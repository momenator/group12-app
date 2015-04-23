import csv
import numpy as np
import sys

debug = False

tags = ['one','two','three','four','five','six','seven','eight','nine','ten']

if __name__ == "__main__":
    with open(sys.argv[1], 'w+') as f:
        csvout = csv.writer(f)
        for row in range(0, 100):
            image_tags = []
            for t in range(0, 10):
                if (np.random.rand() > 0.5):
                    image_tags.append(tags[t])
                    image_tags.append(np.random.rand())
            csvout.writerow(image_tags)