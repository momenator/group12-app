#!/bin/bash
echo "Start $SECONDS"
java -classpath weka.jar weka.classifiers.trees.RandomForest \
    -t ARFF/music_train.arff \
    -d models/music.model
echo "End $SECONDS"