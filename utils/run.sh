#!/bin/sh

kill_em_all() {
    echo "(CTRL+C was hit)"
    kill 0
    exit 0
}

trap 'kill_em_all' INT

# Start the NER server
NER_DIR="abstractor-server/stanford-ner-2013-04-04"
FLASK_DIR="abstractor-server/abstractor"
NER_JAR="stanford-ner-2013-04-04.jar"

cd "$NER_DIR" # Move to NER_DIR

# Run the NER server in the background
java -mx1000m -cp "$NER_JAR" edu.stanford.nlp.ie.NERServer \
    -loadClassifier "classifiers/english.all.3class.distsim.crf.ser.gz" \
    -port 9000 -outputFormat inlineXML 2> ../../ner-server.log &

cd - # Return to orginal dir
cd "$FLASK_DIR" # Move to Flask Python server directory

# Start the Python Flask server
python abstractor.py 2> ../../flask-server.log &

while :
do
    echo "Press [CTRL+C] to stop.."
    sleep 1
done
