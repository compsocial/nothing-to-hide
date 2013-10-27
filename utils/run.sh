#!/bin/sh

# Start the NER server
NER_DIR="abstractor-server/stanford-ner-2013-04-04"
NER_JAR="stanford-ner-2013-04-04.jar"

# Move to NER_DIR
cd "$NER_DIR"

# Run the NER server in the background
java -mx1000m -cp "$NER_JAR" edu.stanford.nlp.ie.NERServer \
    -loadClassifier "classifiers/english.all.3class.distsim.crf.ser.gz" \
    -port 9000 -outputFormat inlineXML &

# Start the Python Flask server
python abstractor/abstractor.py &

trap 'kill $(jobs -p)' SIGINT
