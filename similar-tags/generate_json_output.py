import json
import csv
import sys

with open(sys.argv[2], 'w+') as json_file, open(sys.argv[1], 'r') as csv_file:
    csvin = csv.reader(csv_file)
    rows = 0
    for row in csvin:
        tag = dict()
        if row:
            print row[0]
            if len(row) > 1:
                tag[row[0]] = ','.join(row[1:])
            else:
                tag[row[0]] = ''
            json_file.write(json.dumps(tag) + '\n')