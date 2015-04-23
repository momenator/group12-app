#!/bin/bash

echo "Start $SECONDS"
java -classpath weka.jar weka.filters.supervised.attribute.AddClassification \
     -serialized models/color.model \
     -classification \
     -distribution \
     -remove-old-class \
     -i ARFF/color.arff \
     -o ARFF/color_out.arff \
     -c last
echo "End $SECONDS"