from os.path import abspath
from os import listdir
import csv

parent_path = abspath('../data/')
folders = ('img_decor','img_non_decor')
folder_names = []
for folder in folders:
    folder_names.append([name for name in listdir(parent_path+'/'+folder) if name[-4:] == '.jpg'])

all_names = [name for name in listdir(parent_path+'/images') if name[-4:] == '.jpg']
N = len(all_names)
image_class = [-1]*N

filename = abspath('../ARFF/gabor_all.arff')
file_out = abspath('../ARFF/decor_train.arff')
with open(filename, 'r') as arffin, open(file_out, 'w+') as arffout:
    arffin = csv.reader(arffin)
    arffout = csv.writer(arffout)
    image_index = 0
    for line in arffin:
        if line and len(line[0]) > 0 and line[0][0] != '@':
            name = all_names[image_index]
            found = False
            for f in range(0, len(folders)):
                if name in folder_names[f]:
                    image_class[image_index] = f
                    found = True
            if image_class[image_index] >= 0:
                line[-1] = folders[image_class[image_index]]
                arffout.writerow(line)
            image_index += 1
        else:
            arffout.writerow(line)