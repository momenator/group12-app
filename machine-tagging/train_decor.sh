#!/bin/bash
echo "Start $SECONDS"
java -classpath weka.jar weka.classifiers.trees.RandomForest \
    -t ARFF/decor_train.arff \
    -d models/decor.model
echo "End $SECONDS"