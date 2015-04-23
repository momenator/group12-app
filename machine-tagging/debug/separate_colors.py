import shutil
import arff
from os import listdir, makedirs
import numpy as np

path = 'images/'
names = (listdir(path))
data = arff.read_arff_data('ARFF/color_out.arff')

makedirs('colors/color')
makedirs('colors/bw')

count = 0
for filename in names:
    if filename[-4:] == '.jpg':
        print count
        if data[count][4] <= data[count][5]:
            output_folder = 'bw'
        else:
            output_folder = 'color'
        shutil.copyfile(path+filename, 'colors/'+output_folder+'/'+filename[:-4]+('_%d_%d' % (100*float(data[count][4]),100*float(data[count][5])))+'.jpg')
        count += 1