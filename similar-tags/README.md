Finding Similar Tags
====================

The main file is tag_freq.py which takes in a .csv corresponding to sets of tags, and outputs a set of the most frequently co-occuring tags for every unique tag in the dataset.
Every line in the input CSV corresponds to the tags of a single image. It is run as:
```
python tag_freq.py input_tags.csv similar_tags.csv n
```
Where n is the maximum number of similar tags to return.
Every row in the similar_tags file begins with a unique tag and is followed by the tags that occur most often in the same images, in order, up to a specified percentage

generate_tags.py
----------------

This can be used for generating a test set of tags for testing tag_freq.py:
```
python generate_tags.py tags.csv
```