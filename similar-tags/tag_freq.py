import csv
import numpy as np
import sys

debug = False
k = 20

N = 0

# build list of tags
with open(sys.argv[1], 'r') as f:
    csvin = csv.reader(f)
    tags = {}
    number_tags = 0
    for row in csvin:
        N += 1
        for t in range(0, len(row), 2):
            if not tags.has_key(row[t]):
                tags[row[t]] = number_tags
                number_tags += 1

freq_matrix = np.zeros((number_tags, number_tags))

# populate frequency matrix
with open(sys.argv[1], 'r') as f:
    csvin = csv.reader(f)
    for row in csvin:
        if debug:
            print row
        for t1 in range(0, len(row), 2):
            for t2 in range(0, len(row), 2):
                if t1 != t2:
                    freq_matrix[tags[row[t1]], tags[row[t2]]] += float(row[t1+1])*float(row[t2+1])

# idf
totals = np.sum(freq_matrix, axis=0)
freq_matrix_idf = freq_matrix * np.log(N / (1 + totals[np.newaxis, :]))
# normalise frequency
totals = np.maximum(np.sum(freq_matrix_idf, axis=1), 1)
freq_matrix_norm = freq_matrix_idf / totals[:, np.newaxis]

freq_matrix_sorted = np.argsort(freq_matrix_norm, axis=1)[:, ::-1]

# output top k%
if len(sys.argv) > 3:
    k = int(sys.argv[3])
tags_from_indices = [''] * number_tags
for tag in tags:
    tags_from_indices[tags[tag]] = tag
with open(sys.argv[2], 'w+') as f:
    csvout = csv.writer(f)
    for t in range(0, number_tags):
        row = []
        col = 0
        num_similar = np.sum(freq_matrix[t, :] > 0)
        if num_similar > 0:
            row = [tags_from_indices[t]]
            while col < min(k, num_similar):
                row.append(tags_from_indices[freq_matrix_sorted[t, col]])
                if debug:
                    row.append(freq_matrix[t, freq_matrix_sorted[t, col]])
                col += 1
        csvout.writerow(row)