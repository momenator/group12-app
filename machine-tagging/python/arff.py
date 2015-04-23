from os.path import splitext
import csv

def write(filename, relation_name, attributes, classes, data):
    name, extension = splitext(filename)
    extension = '.arff'
    f = open(filename, 'w+')
    f.write('@RELATION %s\n\n' % relation_name)

    for attribute in attributes:
        f.write('@ATTRIBUTE %s %s\n' % (attribute[0], attribute[1]))

    f.write('@ATTRIBUTE class{%s' % classes[0])
    for current_class in classes[1:]:
        f.write(',' + current_class)
    f.write('}\n\n')

    f.write('@DATA\n')
    for current_values in data:
        f.write(str(current_values[0]))
        for i in range(1, len(current_values)):
            f.write(',' + str(current_values[i]))
        f.write('\n')

    f.close()

def read_data(filename):
    name, extension = splitext(filename)
    extension = '.arff'
    clusters = []
    with open(filename, 'r') as arffin:
        arffin = csv.reader(arffin)
        for line in arffin:
            if line and len(line[0]) > 0 and line[0][0] != '@':
                clusters.append(line)
    return clusters