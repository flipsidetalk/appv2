import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
from sklearn.cluster import KMeans, AffinityPropagation, MeanShift
from sklearn.metrics import silhouette_score, pairwise
import json
import sys


#https://sites.google.com/site/dataclusteringalgorithms/home
#http://datamicroscopes.github.io/
#https://datasciencelab.wordpress.com/2014/01/21/selection-of-k-in-k-means-clustering-reloaded/

'''
class to process votes and perform data analysis to come up with data for visualizations

input: 
    question_ids: list of ids of each of the lines being voted on
    impute_factor: whether we fill in missing values with predictions based on current votes
    min_users: minimum number of users required to get processed data (perform dimension reduction and clustering) for graph
    min_votes: minimum number of votes a user has to make to be considered
    num_opinions: number of claims to show that define each group
'''

ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

QUESTION_IDS = ['a1s21','a1s23','a1s30','a1s31','a1s34','a1s46','a1s55','a2s12','a2s13','a2s14','a2s18','a2s27','a2s45','a3s6','a3s7','a3s10','a3s12','a3s15','a4s25','a4s27','a4s32','a4s40','a4s41','a4s55']

class Spectrum:
    def __init__(self, graph_low_votes = False, reducer = 'mds', cluster = 'kmeans', 
        choosing_function = 'strong', norm_threshold = 100, defval = 0, impute_factor = True, 
        min_users = 6, min_votes = 3, num_opinions = 5, max_users = 1000, n_components = 2):

        self.impute_factor = impute_factor
        self.min_votes = min_votes
        self.graph_low_votes = graph_low_votes


        self.n_components = n_components
        if min_users:
            self.min_users = min_users
        else:
            self.min_users = len(question_ids)

        self.max_users = max_users

        if reducer == 'mds':
            self.dimension_reducer = MDS
        elif reducer == 'pca':
            self.dimension_reducer = PCA

        if cluster == 'affinity':
            self.cluster = AffinityPropagation
        elif cluster == 'kmeans':
            self.cluster = KMeans

        self.num_opinions = num_opinions

        self.choosing_function = choosing_function
        self.norm_threshold = norm_threshold

        self.data = np.zeros((self.max_users, 100))
        
        self.users = dict()
        self.n_users = 0
        self.users_to_graph = list()
        self.votes_to_consider = dict()
        self.normalize = False

        self.question_ids = np.array([])

        self.k = None
        self.considered_points = None
        self.out_points = None
        self.groups = None
        self.relevant_questions = None


    def save_model(self):

        out = dict()
        out['questions'] = {'n_questions':len(self.question_ids), 'questions': list(self.question_ids)}

        vote_matrix = []
        for i in range(self.n_users):
            vote_matrix.append([float(x) for x in list(self.data[i])])
        out['votes'] = {'n_users': self.n_users, 'matrix': vote_matrix}

        out['user_ids'] = self.users
        out['users_to_graph'] = self.users_to_graph
        out['k'] = self.k

        out['out_points'] = []
        if self.out_points is not None:
            for i in range(len(self.out_points)):
                x, y, group = self.out_points[i,0], self.out_points[i,1], self.groups[i]
                out['out_points'].append({"x": float(x), "y": float(y), "group": int(group)})
            
        out['relevant_questions'] = self.relevant_questions

        return json.dumps(out)

    def reinit_model(self, data):
        self.question_ids = np.array(data['questions'])
        self.n_users = data['votes']['n_users']
        for i in range(len(data['votes']['matrix'])):
            self.data[i] = data['votes']['matrix'][i]
        self.users = data['user_ids']
        self.users_to_graph = data['users_to_graph']
        self.k = data['k']
        self.out_points = np.zeros((len(data['out_points']), 2))
        self.groups = np.zeros(len(data['out_points']))
        for i in range(len(data['out_points'])):
            dic = data['out_points'][i]
            self.out_points[i][0], self.out_points[i][1] = np.float64(dic['x']),np.float64(dic['y'])
            self.groups[i] = np.int32(dic['group'])
        self.relevant_questions = {int(k): v for k,v in data['relevant_questions'].items()}





#FUNCTION TO PROCESS VOTES, INTERFACE HERE, ASSUMES VOTE IS (str) 1 if agree, 2 if disagree, 3 if pass
#Input: list of 3-tuples of form (user_id, question_id, vote)
    def add_votes(self, input_votes, process = True):
        enough_votes = False
        votes = [(el['userId'], el['sentenceId'], el['reaction']) for el in input_votes]
        for user_id, question_id, vote in votes:
            try:
                assert (vote == 1 or vote == 0 or vote == -1)
                if user_id not in self.users.keys():
                    #Dictionary key = user_id, Value = [user_index, number of votes they've made]
                        self.users[user_id] = [self.n_users, set([(user_id, question_id)])]
                        self.n_users += 1
                else:
                    self.users[user_id][1].add((user_id, question_id))
                    if len(self.users[user_id][1]) >= self.min_votes:
                        #add index of user if they've added enough votes
                        if self.users[user_id][0] not in self.users_to_graph:
                            self.users_to_graph.append(self.users[user_id][0])
                        enough_votes = True

                #try:
                if question_id not in list(self.question_ids):
                    self.add_question(question_id)

                question_ind = np.where(self.question_ids == question_id)[0][0]
                user_ind = self.users[user_id][0]

                self.data[user_ind][question_ind] = vote
                if question_ind not in self.votes_to_consider.keys(): 
                    self.votes_to_consider[question_ind] = set([user_ind])
                else:
                    self.votes_to_consider[question_ind].add(user_ind)
            except:
                sys.stderr.write('\n\nERROR PROCESSING REACTION: {}\n\n'.format((user_id, question_id, vote)))
        
        enough_users = (len(self.users_to_graph) >= self.min_users)
        enough_questions = len(self.question_ids) >= self.num_opinions
        if process and enough_votes and enough_users and enough_questions:
            self.process()


    def add_question(self, question_id):

        ids = list(self.question_ids)
        ids.append(question_id)
        self.question_ids = np.array(ids)
        if len(self.question_ids) >= self.data.shape[1]:
            new = np.zeros((self.max_users, len(self.question_ids) + 20))
            new[:self.data.shape[0], :self.data.shape[1]] = self.data
            self.data = new



    '''

    output of following form
    var clusterData= [
      {cluster: "A", opinions: [{sentenceId:"s1q1", decision: "agree", average: 100}, {sentenceId:"s1q1", decision: "agree", average: 100}]}
    ];
    //111 and 112 represent userIds
    var pointData = {111: {cluster: "A", "x": 100, "y": 50}, 112:{cluster: "A", "x": 100, "y": 50}}:
    var shadeData = [
      {cluster: "A", shading:[{ "x": 0, "y": 0},  { "x": 100,  "y": 0}, { "x": 100,  "y": 200}, { "x": 0,   "y": 0}]},
      {cluster: "B", shading:[{ "x": -10,   "y": -10},  { "x": -30,  "y": -150}, { "x": -200,  "y": -250}, { "x": -10,   "y": -10}]}
    ];
    output = {"clusterData": clusterData, "pointData":pointData, "shadeData": shadeData}
    '''
    def get_visualization_data(self):
            '''
            if self.graph_low_votes:
                data = {"clusterData" : [], "pointData" : {}, "shadeData":[]}
                index_by_ind = {v[0]:k for k,v in self.users.items()}
                user_ids = [index_by_ind[ind] for ind in range(self.n_users)]
                xs, ys = self.out_points[:,0], self.out_points[:,1]
                x_min, x_max, y_min, y_max = min(xs), max(xs), min(ys), max(ys)
                data['extremes'] = {"xMin": float(x_min), "xMax": float(x_max), "yMin": float(y_min), "yMax": float(y_max)}
                #Adding group placeholder for people who aren't considered yet
                groups = []
                c = 0
                for i in range(self.n_users):
                    if i in self.users_to_graph:
                        groups.append(self.groups[c])
                        c += 1
                    else:
                        groups.append(None)

                for iden, x, y, group in zip(user_ids, xs, ys, groups):
                    group_label = None
                    if group is not None:
                        group_label = int(group)
                    else:
                        group_label = 'UNGROUPED: NOT ENOUGH VOTES'

                    data["pointData"][iden] = {"x":x, "y":y, "cluster":group_label}

                for i in range(self.k):
                    group_data = []
                    c = 0
                    for iden, x, y, group in zip(user_ids, xs, ys, groups):
                        group_label = None
                        if group == i:
                            group_data.append({"iden":iden, "x":x, "y":y, "group":int(group)})
                            group_label = int(i)
                        else:
                            group_label = 'UNGROUPED: NOT ENOUGH VOTES'

                    points = [(el["x"],el["y"]) for el in group_data]
                    perimeter_points = GrahamScan([(el["x"],el["y"]) for el in group_data])
                    path = [{"x":x,"y":y} for x, y in zip(perimeter_points[:,0], perimeter_points[:,1])]
                    path.append(path[0])
                    data["shadeData"].append({"cluster":int(i), "shading": path})
                    if self.relevant_questions is not None:
                        relevant_positions = [{"sentenceId":question,"cluster":int(i), "average":self.average_answer(i, question), "phrase": self.get_agreement_phrase(i,question)} for question in self.relevant_questions[i]]
                        data["clusterData"].append(relevant_positions)
                return data
                '''
            if len(self.votes_to_consider) != 0:
                data = []
                index_by_ind = {v[0]:k for k,v in self.users.items()}
                user_ids = [index_by_ind[ind] for ind in self.users_to_graph]
                #Adding group placeholder for people who aren't considered yet

                clusters = self.groups is not None
                r = 0
                if self.k is not None:
                    r = self.k
                for i in range(-1, r):
                    if not clusters:
                        if i > -1:
                            return data
                    group = dict()
                    group['group'] = i + 1
                    users = []
                    gs = [None] * len(user_ids)
                    if self.groups is not None:
                        gs = list(self.groups)
                    for iden, g in zip(user_ids, gs):
                        if g == i or i == -1:
                            users.append(iden)
                    group['users'] = users
                    group['size'] = len(users)

                    if self.relevant_questions is None:
                        self.relevant_questions = {-1: set(self.question_ids)}
                    relevant_positions = []
                    for question in self.relevant_questions[i]:
                        claim_data = dict()
                        claim_data['sentenceId'] = str(question)
                        avg,controversiality, num_votes,proportions = self.get_numbers(i, question)
                        if avg is not None:
                            avg = float(avg)
                        if controversiality is not None:
                            controversiality = float(controversiality)
                        if num_votes is not None:
                            num_votes = float(num_votes)
                        claim_data['average'] = avg
                        claim_data['shadeColor'] = self.range_normalize(0, 1, 0.3, 0.1, avg)
                        claim_data['controversiality'] = controversiality
                        claim_data['num_votes'] = num_votes
                        for answer, direction in zip([-1,0,1], ['disagree', 'unsure', 'agree']):
                            if answer in proportions.keys():
                                if proportions[answer] is not None:
                                    proportions[answer] = float(proportions[answer])
                                claim_data[direction] = proportions[answer]
                            else:
                                claim_data[direction] = None
                        relevant_positions.append(claim_data)
                    group['sentences'] = relevant_positions
                    data.append(group)
                    del group
                return data
            else:
                return []

    def range_normalize(self, minimum, maximum, newmin, newmax, value):
        if value == 0:
            return 0
        elif value is not None:
            sign = value > 0
            factor = newmax - newmin
            denom = maximum - minimum
            out = (factor * ((value - minimum) / denom)) + newmin
            if sign:
                return out
            else:
                return -out
        else:
            return None

    def get_numbers(self, i, question):
        votes = []
        question_ind = np.where(self.question_ids == question)[0][0]
        for user_ind in self.votes_to_consider[question_ind]:
            if user_ind in self.users_to_graph:
                index = np.where(np.array(self.users_to_graph) == user_ind)[0][0]
                if self.groups[index] == i or i == -1:
                    vote = self.data[user_ind, question_ind]
                    votes.append(vote)

        group_answers = {}
        avg = None
        controversiality = None
        num_votes = len(votes)
        if num_votes >= self.min_votes:
            controversiality = float(np.std(votes) / np.sqrt(num_votes))
            avg = float(np.mean(votes))
            votes = np.array(votes)
            total = 0
            for answer in [-1,0,1]:
                num_votes = float(np.where(votes == answer)[0].shape[0])
                group_answers[answer] = float(num_votes / len(votes))
        
        return avg,controversiality,  num_votes, group_answers

    def get_agreement_phrase(self, i, question):
        value = self.average_answer(i, question)
        opinion = None
        if value > 0:
            opinion = 'agreement'
        elif value < 0:
            opinion = 'disagreement'
        elif value == 0:
            opinion = 'neutral'

        degree = None
        if 0 <= abs(value) < 0.33:
            degree = 'weak'
        elif 0.33 <= abs(value) < 0.67:
            degree = 'moderate'
        elif 0.67 <= abs(value) <= 1:
            degree = 'strong'

        if opinion == 'neutral':
            return opinion
        else:
            return 'in ' + degree + ' ' + opinion

    def get_points(self):
        if self.out_points is not None:
            return self.out_points
        else:
            print('need more data')
            return None

    def get_groups(self):
        if self.groups is not None:
            return self.groups
        else:
            print('need more data')
            return None


    def convert(self, vote):
        if int(vote) == 1:
            return 1
        elif int(vote) == 2:
            return -1
        elif int(vote) == 3:
            return 0

    def process(self):
        if self.n_users >= self.norm_threshold:
            self.normalize = True

        self.dimension_reduction()
        self.make_groups()
        if self.groups is not None:
            if self.cluster == KMeans:
                self.relevant_questions = self.find_relevant_claims()
            #elif self.cluster == AffinityPropagation:
                #self.relevant_questions = self

    def impute(self, data):
        if self.impute_factor:
            filled_in = np.where(data != 0)
            done_votes = data[filled_in]
            #IMPUTATION STEP
            u , s, v = np.linalg.svd(data)
            diag = np.zeros(data.shape)
            diag[range(min(data.shape)), range(min(data.shape))] = s
            new_data = np.matrix(u) * np.matrix(diag) * np.matrix(v)

            new_data[filled_in] = done_votes
            return new_data
        else:
            return data

    def dissimilarity(self, X):
        return pairwise.cosine_distances(X)


    def dimension_reduction(self):
        new_data = self.data[self.users_to_graph]
        if self.impute_factor:
            new_data = self.impute(new_data)
        if self.dimension_reducer == PCA:
            self.dimension_reducer = self.dimension_reducer(n_components = self.n_components, metric = False)
            self.considered_points = self.dimension_reducer.fit_transform(new_data)
            self.out_points = self.dimension_reducer.transform(self.impute(self.data[:self.n_users]))
        elif self.dimension_reducer == MDS:
            self.dimension_reducer = self.dimension_reducer(n_components = self.n_components, dissimilarity = 'precomputed', metric = False, n_init = 20, random_state = 0)
            self.considered_points = self.dimension_reducer.fit_transform(self.dissimilarity(new_data))
            
            #MDS cannot perform feature transformation on new data, so cannot graph people who don't have enough votes
            self.out_points = self.considered_points

    def make_groups(self):
        best_score = 0
        best_groupings = None
        best_k = None
        k = 2

        if self.cluster == KMeans:

            while k <= len(self.users_to_graph) // 2:
                kmeans = self.cluster(n_clusters = k, n_init = 50, random_state = 0)
                groups = kmeans.fit_predict(self.considered_points)
                num_members = [(groups == k_num).sum() for k_num in range(k)]
                
                if min(num_members) >= 3:
                    score = silhouette_score(self.considered_points, groups)
                    if score > best_score:
                        best_score = score
                        best_groupings = groups
                        best_k = k
                k += 1

            self.k = best_k
            self.groups = best_groupings

        elif self.cluster == AffinityPropagation:
            preference = [len(np.where(np.nonzero(self.data[self.users_to_graph])[0] == i)[0]) for i in range(len(self.users_to_graph))]
            self.cluster = self.cluster(preference = preference)
            self.groups = self.cluster.fit_predict(self.considered_points)
            self.k = len(self.cluster.cluster_centers_indices_)



    def find_stds(self):
        relevant_questions = dict()
        group_averages = np.zeros((model.k, len(model.question_ids)))
        question_std = np.zeros(len(model.question_ids))
        for q_ind in range(len(model.question_ids)):
            u_inds = list(model.votes_to_consider[q_ind])
            stdev = np.std(model.data[u_inds, q_ind])
            if stdev == 0:
                stdev = 0.000001
            question_std[q_ind] = stdev
        return question_std

    def get_group_averages(self):
        group_averages = np.zeros((self.k, len(self.question_ids)))
        for c in range(self.k):
            group_indices = np.where(self.groups == c)[0]
            averages = []
            for q_ind in range(len(self.question_ids)):
                user_inds = list(set(group_indices).intersection(self.votes_to_consider[q_ind]))
                if user_inds:
                    averages.append(np.mean(self.data[user_inds, q_ind]))
                else:
                    averages.append(0)
            group_averages[c] = np.array(averages)
        return group_averages

    def differentiate_claims(self, group_averages, question_std):
        relevant_questions = dict()
        relevant_questions = []
        for group in range(self.k):
            sum_squared_differences = np.zeros(len(self.question_ids))
            for other_group in range(self.k):
                if group != other_group:
                    mean_deviations = np.absolute(group_averages[group] - group_averages[other_group])
                    if question_std:
                        sum_squared_differences += mean_deviations / question_std
                    else:
                        sum_squared_differences += mean_deviations
            #Taking the opinions for which differences are biggest
            threshold = sorted(sum_squared_differences)[-(self.num_opinions)]
            important_questions = np.where(sum_squared_differences >= threshold)[0][:self.num_opinions]
            relevant_questions[group] = list(self.question_ids[important_questions])
            relevant_questions[-1] += relevant_questions
        relevant_questions[-1] = list(set(relevant_questions[-1]))
        return relevant_questions

    def strongest_claims(self, group_averages, question_std):
        all_opinions = []

        for key in range(len(group_averages)):
            indexed_averages = [(group_averages[key][i], i, key) for i in range(len(group_averages[key]))]
            all_opinions += indexed_averages

        all_opinions = sorted(all_opinions, reverse = True)

        question_candidates = dict()
        strongest_claims = dict()
        strongest_claims[-1] = []
        for avg, question_ind, group in all_opinions:
            if question_ind not in question_candidates:
                question_candidates[question_ind] = 1
            else:
                question_candidates[question_ind] += 1
            if question_candidates[question_ind] <= self.k//2:
                if group in strongest_claims.keys():
                    if len(strongest_claims[group]) >= self.num_opinions:
                        pass
                    else:
                        strongest_claims[group].append(self.question_ids[question_ind])
                else:
                    strongest_claims[group] = [self.question_ids[question_ind]]

        for i in range(self.k): 
             strongest_claims[-1] += strongest_claims[i]
        strongest_claims[-1] = list(set(strongest_claims[-1]))
        return strongest_claims

    def find_relevant_claims(self):
        question_std = None
        if self.normalize:
            try:
                question_std = self.find_stds()
            except:
                sys.stderr.write("Couldn't Normalize")
                pass

        group_averages = self.get_group_averages()

        if self.choosing_function == 'strong':
            chooser = self.strongest_claims
        else:
            chooser = self.differentiate_claims

        return chooser(group_averages, question_std)





# Function to know if we have a CCW turn
def RightTurn(p1, p2, p3):
    if (p3[1]-p1[1])*(p2[0]-p1[0]) >= (p2[1]-p1[1])*(p3[0]-p1[0]):
        return False
    return True
    
# Main algorithm:
def GrahamScan(P):
    P.sort()            # Sort the set of points
    L_upper = [P[0], P[1]]      # Initialize upper part
    # Compute the upper part of the hull
    for i in range(2,len(P)):
        L_upper.append(P[i])
        while len(L_upper) > 2 and not RightTurn(L_upper[-1],L_upper[-2],L_upper[-3]):
            del L_upper[-2]
    L_lower = [P[-1], P[-2]]    # Initialize the lower part
    # Compute the lower part of the hull
    for i in range(len(P)-3,-1,-1):
        L_lower.append(P[i])
        while len(L_lower) > 2 and not RightTurn(L_lower[-1],L_lower[-2],L_lower[-3]):
            del L_lower[-2]
    del L_lower[0]
    del L_lower[-1]
    L = L_upper + L_lower       # Build the full hull
    return np.array(L)





















