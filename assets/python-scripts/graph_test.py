import graph_data_construction
import pandas as pd
import numpy as np
#COMMAND TO GET DATA FROM SQL TABLES: 
#SELECT sentenceId, userId, reaction, test.articles.Id as articleId FROM test.votes JOIN test.sentences on test.votes.sentenceId=test.sentences.id JOIN test.articles ON test.sentences.articleId = test.articles.id JOIN test.titles ON test.articles.id=test.titles.articleId


class OpinionBubbleTest:
    def __init__(self, csv_input = True, article_id = 45, input_data = '/Users/siddharth/flipsideML/ML-research/visualization/prodvotedata.csv', min_votes = 5, sample_size = 1.0):
        if csv_input:
            self.data = pd.read_csv(input_data)
        else:
            self.data = input_data
        self.min_votes = min_vote
        self.sample_size = sample_sizes
        self.article_id = article_id

    def run(self):
        self.data = self.parse_data(self.article_id)[self.article_id]
        self.run_model()
        self.users_with_probs = self.check_membership()
        assert len(self.viz_data) != 0, "didn't get out data"
        assert len(self.users_with_probs) == 0, "grouping didn't work properly"
        
    def parse_data(self, articleId):
        out = {}
        c= 0
        for i in range(len(self.data)):                                                                                                 
            row = self.data.iloc[i]
            row = {key: row[key] for key in row.index}
            row['reaction'] = int(row['reaction'])
            if 'articleId' not in row:
                print(row)
                c += 1
            else:
                if row['articleId'] == articleId:
                    vote = {'userId': row['userId'], 'sentenceId': row['sentenceId'], 'reaction':row['reaction'], 'articleId': row['articleId']}
                    if row['articleId'] not in out.keys():
                        out[row['articleId']] = [vote]
                    else:
                        out[row['articleId']].append(vote)
                else:
                                    
                    vote = {'userId': row['userId'], 'sentenceId': row['sentenceId'], 'reaction':row['reaction']}
                    if row['articleId'] not in out.keys():
                        out[row['articleId']] = [vote]
                    else:
                        out[row['articleId']].append(vote)
        print("NUM_VOTES WITHOUT ARTICLEID:{}".format(c))
        return out

    def run_model(self, votes = None, sample = 1.0):
        if votes is None:
            votes = self.data
        num_samples = None
        if type(sample) == float:
            num_samples = int(len(votes) * sample)
        else:
            num_samples = sample
        self.sampled_votes = np.random.choice(votes, num_samples, replace=False)
        model = graph_data_construction.Spectrum(min_votes = self.min_votes)
        model.add_votes(self.sampled_votes)
        self.viz_data = model.get_visualization_data()

    def check_membership(self):
        votes = self.sample_votes
        viz_data = self.viz_data
        num_votes = {}
        for vote in votes:
            if vote['userId'] not in num_votes.keys():
                num_votes[vote['userId']] = {'count':1, 'grouped':False}
            else:
                num_votes[vote['userId']]['count'] += 1

        users_with_probs = set()
        for group in viz_data:
            if group['group'] == 0:
                #ALL GROUP
                for user in num_votes.keys():
                    if user not in group['users']:
                        users_with_probs.add(user)
            else:
                
                for user in num_votes.keys():
                    if user in group['users']:
                        num_votes[user]['grouped'] = True
                for user in num_votes.keys():
                    user_obj = num_votes[user]
                    if not user_obj['grouped'] and user_obj['count'] >= self.min_votes:
                        print('USER {} WITH {} VOTES NOT GROUPED'.format(user, user_obj['count']))
                        users_with_probs.add(user)


        self.users_with_probs = users_with_probs


if __name__ == "__main__":
    test = OpinionBubbleTest()
