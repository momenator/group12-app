#!/bin/bash
echo "Start $SECONDS"
java -classpath weka.jar weka.filters.unsupervised.attribute.ClusterMembership \
    -W weka.clusterers.EM \
    -i shape_small.arff \
    -o out_small.arff \
    -- \
    -N 5 \
    -I 10
echo "End $SECONDS"