import spacy
import networkx as nx
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
#from nltk.corpus import stopwords
#from textblob import TextBlob
import re
#from newspaper import Article
import pickle
import torch
import boilerpipe.extract
import urllib
import requests as req
import nltk

LANG_MOD = spacy.load('en', vectors = False)

subj_path = '/Users/siddharth/flipsideML/ML/keysent_extraction/subjectivity/InferSent/subj_classifier.pickle'
CLF = pickle.load(open(subj_path, 'rb'))

VECTORIZER = torch.load('/Users/siddharth/flipsideML/ML/keysent_extraction/subjectivity/InferSent/encoder/infersent.allnli.pickle', map_location=lambda storage, loc: storage)
VECTORIZER.use_cuda = False

glove_path = '/Users/siddharth/flipsideML/ML/keysent_extraction/subjectivity/InferSent/dataset/GloVe/glove.6B/glove.6B.300d.txt'
VECTORIZER.set_glove_path(glove_path)

WORD2VEC_DIMENSIONS = 300
#STOP = set(stopwords.words('english'))
REGEX = re.compile(r'[^a-zA-Z]')

DIFFBOT_TOKEN = '1e60df58fbb4330c3aef18a335be17ee'

def textrankScores(sentence_vecs):
	similarity = cosine_similarity(np.array(sentence_vecs))
	nx_graph = nx.from_numpy_matrix(similarity)
	scores = nx.pagerank(nx_graph)
	scores = np.array([scores[ind] for ind in scores.keys()])
	return scores

def normalize(array):
	out = array - min(array)
	out /= max(array) - min(array)
	return out

def opinion_score(sentence_vec):
	return CLF.predict_proba(sentence_vec)

def make_vecs(sentences):
	VECTORIZER.build_vocab(sentences, tokenize=True)
	sent_vecs = VECTORIZER.encode(sentences, tokenize = True)
	return sent_vecs

def get_representations(sents, average = False):
	sentence_vecs = []
	subjectivities = []
	if average:
		for sent in sents:
			sentence_vec = np.zeros(WORD2VEC_DIMENSIONS)
			c = 0
			sentence_string = ''
			for i in range(len(sent)):
				word = sent[i]
				text = REGEX.sub('', word.text) 
				if text and text not in STOP and len(np.nonzero(word.vector)[0]) != 0:
					sentence_vec += word.vector
					c += 1

			if c != 0:
				subj = opinion_function(sent.text)
				sentence_vec /= c
				sentence_vecs.append(sentence_vec)
				subjectivities.append(subj)
	else:
		sentence_vecs = make_vecs(sents)


	return sentence_vecs

def newspaper_parse(url):
	article = Article(url)
	article.download()
	article.parse()
	print('\ntitle: {}\n'.format(article.title))
	print('\nsource: {}\n'.format(article.source_url))
	print('\nauthors: {}\n'.format(article.authors))
	print('\ntags: {}\n'.format(article.tags))
	print('\ntext: {}\n'.format(article.text))
	return article.text

def boilerpipe_parse(url):
	e = boilerpipe.extract.Extractor(extractor='ArticleExtractor', url = url)
	return e.getText()

def diffbot_parse(url):
	api = 'https://api.diffbot.com/v3/article'
	params = {'token': DIFFBOT_TOKEN, 'url': url}
	query = api + '?' + urllib.parse.urlencode(params)
	response = req.get(query).json()
	data = response['objects'][0]
	return data#text



class Extractor:
	def __init__(self, parser = diffbot_parse, opinion_function = opinion_score, 
					representation_extractor = get_representations,
					score_extractor = textrankScores, importance_prop = 0.8,
					subj_threshold = 0.8, nlp = LANG_MOD):
		self.importance_prop = importance_prop
		if subj_threshold is not None:
			self.subj_threshold = subj_threshold
		else:
			self.subj_threshold = 0.5
		self.representation_extractor = get_representations
		self.score_extractor = score_extractor
		self.opinion_function = opinion_function
		self.nlp = nlp
		self.parser = parser

	def extract_sents(self, document_string):
		doc = self.nlp(document_string)
		sents = [sent.text for sent in doc.sents]
		sentence_vecs = self.representation_extractor(sents)

		subjectivities = self.opinion_function(sentence_vecs)
		opinion_sents = set(np.where(subjectivities >= self.subj_threshold)[0])

		scores = self.score_extractor(sentence_vecs)
		norm_scores = normalize(scores)
		importance_threshold = sorted(norm_scores, reverse = True)[int(len(norm_scores) * (1 - self.importance_prop))]
		important_sents = set(np.where(norm_scores > importance_threshold)[0])
		
		summary_ind = important_sents.intersection(opinion_sents)

		out_data = []
		for i in range(len(sents)):
			agreeable = False
			if i in summary_ind:
				agreeable = True
			endpara = False
			if '\n' in sents[i]:
				endpara = True
			out_data.append({'sent_text': sents[i], 'agreeable': agreeable, 'endpara': endpara, 'index': i})

		return out_data

	def get_out_data(self, url):
		article_object = self.parser(url)
		identical = ['author', 'date', 'title', 'siteName', 'text', 'tags']
		out = {key: article_object[key] for key in identical}
		out['url'] = url

		for tag in out['tags']:
			del tag['count']
			
		for image in article_object['images']:
			if image['primary']:
				out['image'] = image['url']
				break

		sent_data = self.extract_sents(article_object['text'])
		out['sents'] = sent_data
		
		return out







