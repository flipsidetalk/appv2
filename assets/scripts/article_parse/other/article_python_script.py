import Extractor
import sys, json

def read_inp():
	raw_inp = sys.stdin.readlines()
	inp = json.loads(raw_inp[0])
	return inp

def main():
    url = read_inp()[0]
    extractor = Extractor.Extractor()
    parsed_article = extractor.get_out_data(url)#QUESTIONS)
    print(json.dumps(parsed_article))

#start process
if __name__ == '__main__':
    main()
