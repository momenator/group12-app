#!/bin/bash
echo "Start $SECONDS"
java -classpath weka.jar weka.classifiers.trees.RandomForest \
    -t ARFF/color_train.arff \
    -d models/color.model
echo "End $SECONDS"

echo "Start $SECONDS"
java -classpath weka.jar weka.filters.supervised.attribute.AddClassification \
     -serialized models/color.model \
     -classification \
     -distribution \
     -remove-old-class \
     -i ARFF/color_train.arff \
     -o ARFF/color_out.arff \
     -c last
echo "End $SECONDS"