import shutil
import arff
from os import listdir, makedirs
from os.path import abspath
import numpy as np

path = abspath('../data/images/')+'/'
names = (listdir(path))
data = arff.read_data(abspath('../ARFF/decor_out.arff'))

makedirs(abspath('../decor/decor'))
makedirs(abspath('../decor/non_decor'))

count = 0
for filename in names:
    if filename[-4:] == '.jpg':
        print count
        if data[count][33] > data[count][34]:
            output_folder = abspath('../decor/decor')
        else:
            output_folder = abspath('../decor/non_decor')
        shutil.copyfile(path+filename, output_folder+'/'+filename[:-4]+('_%d_%d' % (100*float(data[count][33]),100*float(data[count][34])))+'.jpg')
        count += 1