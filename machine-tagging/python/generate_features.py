import numpy as np
from os import listdir
from os.path import abspath
import features
import arff

def get_features(filename):
    return features.gabor_features(filename)

data = []
data_name = 'music'
data_type = 'train'
parent_path = abspath('../data/')
folders = ('img_music_hand','img_non_music','img_music_print')
if len(folders) > 1:
    classes = folders
else:
    classes = ('music_hand','not_music')

count = 0
for folder in folders:
    path = parent_path + '/' + folder + '/'
    names = [name for name in listdir(path) if name[-4:] == '.jpg']
    for filename in names:
        print count, path + filename
        all_features = get_features(path + filename)
        current_features = list([])
        for i in range(0, all_features.shape[0]):
            current_features.append('%.12f' % all_features[i])
        if len(folders) > 1:
            current_features.append(folder)
        else:
            current_features.append(classes[0])
        data.append(current_features)
        count += 1

num_features = len(current_features) - 1
feature_names = []
for i in range(0, num_features):
    feature_names.append(('feature_' + str(i), 'REAL'))
arff.write(abspath('../ARFF/') + '/' + data_type + '_' + data_name + '.arff', data_name, feature_names, classes, data)