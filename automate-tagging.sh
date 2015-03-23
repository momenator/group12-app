#!/bin/bash
for i in {1..500}
do
   curl localhost:3000/search/random
   echo "\n"
   echo "Image number $i visited and tagged"
done