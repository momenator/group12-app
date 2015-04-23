import shutil
import arff
from os import listdir, makedirs
import numpy as np

path = 'images/'
names = (listdir(path))
clusters = arff.read_arff_data('shape_out.arff')
num_clusters = len(clusters[0])

for cluster in range(0, num_clusters):
    makedirs('clusters/' + str(cluster))

count = 0
for filename in names:
    if filename[-4:] == '.jpg':
        print count
        best_cluster = np.argmax(clusters[count])
        shutil.copyfile(path+filename, 'clusters/'+str(best_cluster)+'/'+filename[:-5]+'_'+('%d' % (100*float(clusters[count][best_cluster])))+'.jpg')
        count += 1