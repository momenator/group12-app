#!/bin/bash

echo "Start $SECONDS"
java -classpath weka.jar weka.filters.supervised.attribute.AddClassification \
     -serialized models/music.model \
     -classification \
     -distribution \
     -remove-old-class \
     -i ARFF/music.arff \
     -o ARFF/music_out.arff \
     -c last
echo "End $SECONDS"