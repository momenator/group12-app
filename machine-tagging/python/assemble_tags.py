import csv
from os import listdir
from os.path import abspath
import json

all_names = [name for name in listdir(abspath('../data/images')) if name[-4:] == '.jpg']

arff_folder = abspath('../ARFF') + '/'

# Name | Shape 0 | Shape 1 | Shape 2 | Shape 3 | Color | BW | Decor | Music | Music Printed | Hand
tag_names = ('','tall','square','very wide','wide','colour','black and white','decorative','sheet music','printed music','handwritten')
image_tags = []

with open(arff_folder + 'shape_out.arff', 'r') as shape_in:
    shape_in = csv.reader(shape_in)
    image_index = 0
    for line in shape_in:
        if line and len(line[0]) > 0 and line[0][0] != '@':
            current_image_tags = []
            name = all_names[image_index][:-4]
            current_image_tags.append(name)
            for s in range(0, 4):
                current_image_tags.append(line[s])
            image_tags.append(current_image_tags)
            image_index += 1

with open(arff_folder + 'color_out.arff', 'r') as color_in:
    color_in = csv.reader(color_in)
    image_index = 0
    for line in color_in:
        if line and len(line[0]) > 0 and line[0][0] != '@':
            current_image_tags = image_tags[image_index]
            for s in range(4, 6):
                current_image_tags.append(line[s])
            image_index += 1

with open(arff_folder + 'decor_out.arff', 'r') as decor_in:
    decor_in = csv.reader(decor_in)
    image_index = 0
    for line in decor_in:
        if line and len(line[0]) > 0 and line[0][0] != '@':
            current_image_tags = image_tags[image_index]
            current_image_tags.append(line[33])
            image_index += 1

with open(arff_folder + 'music_out.arff', 'r') as music_in:
    music_in = csv.reader(music_in)
    image_index = 0
    for line in music_in:
        if line and len(line[0]) > 0 and line[0][0] != '@':
            current_image_tags = image_tags[image_index]
            current_image_tags.append(str(1 - float(line[34])))
            current_image_tags.append(line[35])
            current_image_tags.append(line[33])
            image_index += 1

with open(abspath('../data/images.json')) as json_in, open(abspath('../data/images_ml_tags.json'), 'w+') as json_out:
    l = 0
    for line in json_in:
        print l
        image = json.loads(line)
        index = [i for i,x in enumerate(image_tags) if x[0] == image['flickr_id'].values()[0]]
        if index:
            index = index[0]
            machine_tags = []
            for t in range(1, 11):
                if float(image_tags[index][t]) > 0.05:
                    current_tag = dict()
                    current_tag['tag'] = tag_names[t]
                    current_tag['confidence'] = 100*float(image_tags[index][t])
                    machine_tags.append(current_tag)

            image['machineTags'] = machine_tags
        json_out.write(json.dumps(image, json_out))
        json_out.write('\n')
        l += 1