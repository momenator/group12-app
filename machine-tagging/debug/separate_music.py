import shutil
import arff
from os import listdir, makedirs
from os.path import abspath
import numpy as np

path = abspath('../data/images/')+'/'
names = (listdir(path))
data = arff.read_data(abspath('../ARFF/music_out.arff'))

makedirs(abspath('../music/hand'))
makedirs(abspath('../music/print'))
makedirs(abspath('../music/not'))

count = 0
for filename in names:
    if filename[-4:] == '.jpg':
        print count
        if np.argmax(data[count][33:36]) == 0:
            output_folder = abspath('../music/hand')
        elif np.argmax(data[count][33:36]) == 1:
            output_folder = abspath('../music/not')
        else:
            output_folder = abspath('../music/print')
        shutil.copyfile(path+filename, output_folder+'/'+filename[:-4]+('_%d_%d' % (100*float(data[count][33]),100*float(data[count][34])))+'.jpg')
        count += 1