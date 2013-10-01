from flask import Flask, jsonify, request
import re, string, ner
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag.stanford import POSTagger
from onetfreq import top10k, top5k, top1k

app = Flask(__name__)
nerify = ner.SocketNER(host='localhost', port=9000)
# need to move this to a more permanent location
st = POSTagger('stanford-postagger/models/english-bidirectional-distsim.tagger',
'stanford-postagger/stanford-postagger-3.2.0.jar')

punct = re.compile('[%s]' % re.escape(string.punctuation))
# note these are in reverse order of use for pop() later
altperson = ['somebody else still', 'an individual', 'another person',
'somebody else', 'someone else', 'someone', 'this person']
altloc = ['that spot', 'that site', 'that location', 'there', 'that place']
altnoun = ['that thing']
altverb = ['something']

@app.route("/named_entities", methods=['POST'])
def ner_process():
    text = request.form["text"].encode("utf-8")
    return jsonify(stanfordner(text))

def stanfordner(text):
    return nerify.get_entities(text)

@app.route("/abstractify",  methods=['POST'])
def abstractify():
    text = request.form["text"].encode("utf-8")
    return abstract(text)

def abstract(text):
    #text = re.sub(' +', ' ', text)
    ne = stanfordner(text)
    transformations = {}

    if 'PERSON' in ne:
        people = ne['PERSON']
        for p in people:
            transformations[p] = 'he or she'
            text = re.sub(p, 'he or she', text)

    if 'LOCATION' in ne:
        places = ne['LOCATION']
        for l in places:
            transformations[l] = 'there'
            text = re.sub(l, 'there', text)

    if 'ORGANIZATION' in ne:
        orgs = ne['ORGANIZATION']
        for o in orgs:
            transformations[o] = 'the organization'
            text = re.sub(o, 'the organization', text)

    for wordlist in [word_tokenize(s) for s in sent_tokenize(text)]:
        pos = st.tag(wordlist)
        for pair in pos:
            word = pair[0]
            postag = pair[1]
            if not re.match(punct, word) and word.lower() not in top10k:
                if postag.startswith('N'):
                    transformations[word] = 'that'
                    text = re.sub(word, 'that', text)
                elif postag.startswith('VB'):
                    transformations[word] = 'did'
                    text = re.sub(word, word[0]+'[v]', text)

    return jsonify(transformations)

if __name__ == "__main__":
    app.run(debug=True)
