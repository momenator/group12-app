#!/bin/bash
echo "Start $SECONDS"
ipython generate_features.py
echo "Processing $SECONDS"
java -classpath weka.jar weka.filters.unsupervised.attribute.ClusterMembership \
    -W weka.clusterers.EM \
    -i shape.arff \
    -o out.arff \
    -- \
    -N 5 \
    -I 10
echo "Clustered $SECONDS"
ipython separate_clusters.py
echo "End $SECONDS"