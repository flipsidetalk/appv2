import graph_data_construction
import pandas as pd

def get_data():
    data = pd.read_csv('/Users/siddharth/flipsideML/ML-research/visualization/prodvotedata.csv')[['userId', 'sentenceId', 'reaction']]
    out = []

    for i in range(len(data)):                                                                                                 
        row = data.iloc[i]
        row = {key: row[key] for key in row.index}
        row['reaction'] = int(row['reaction'])
        out.append(row)
    print(len(out))

    model = graph_data_construction.Spectrum(min_votes = 5)

    model.add_votes(out)

    return model.get_visualization_data()

if __name__ == "__main__":
    print(get_data())
