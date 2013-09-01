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
    text = re.sub(' +', ' ', text)
    ne = stanfordner(text)

    if 'PERSON' in ne:
        people = ne['PERSON']
        for p in people:
            text = re.sub(p, p[0]+'[p]', text)

    if 'LOCATION' in ne:
        places = ne['LOCATION']
        for l in places:
            text = re.sub(l, l[0]+'[l]', text)

    if 'ORGANIZATION' in ne:
        orgs = ne['ORGANIZATION']
        for o in orgs:
            text = re.sub(o, o[0]+'[o]', text)

    for wordlist in [word_tokenize(s) for s in sent_tokenize(text)]:
        pos = st.tag(wordlist)
        for pair in pos:
            word = pair[0]
            postag = pair[1]
            if not re.match(punct, word) and word.lower() not in top10k:
                if postag.startswith('N'):
                    text = re.sub(word, word[0]+'[n]', text)
                elif postag.startswith('VB'):
                    text = re.sub(word, word[0]+'[v]', text)

    return text

if __name__ == "__main__":
    app.run(debug=True)
