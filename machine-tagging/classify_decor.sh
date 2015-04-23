#!/bin/bash

echo "Start $SECONDS"
java -classpath weka.jar weka.filters.supervised.attribute.AddClassification \
     -serialized models/decor.model \
     -classification \
     -distribution \
     -remove-old-class \
     -i ARFF/decor.arff \
     -o ARFF/decor_out.arff \
     -c last
echo "End $SECONDS"