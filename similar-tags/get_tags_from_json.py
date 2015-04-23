import json
import csv
import sys

def confidenceToScore(confidence):
    return str(float(confidence)/100.0)

with open(sys.argv[1]) as json_file, open(sys.argv[2], 'w+') as csv_file:
    csvout = csv.writer(csv_file)
    i = 0
    for line in json_file:
        picture = json.loads(line)
        all_tags = []
        if picture.has_key('alchemyTags'):
            tags = picture['alchemyTags']
            if tags:
                all_tags.append(tags[0]['text'])
                all_tags.append(tags[0]['score'])
                if all_tags:
                    for tag in tags[1:]:
                        all_tags.append(tag['text'])
                        all_tags.append(tag['score'])
        num_alchemy_tags = len(all_tags)/2

        if picture.has_key('imaggaTags'):
            tags = picture['imaggaTags']
            if tags:
                all_tags.append(tags[0]['tag'])
                all_tags.append(confidenceToScore(tags[0]['confidence']))
                if all_tags:
                    for tag in tags[1:]:
                        all_tags.append(tag['tag'])
                        all_tags.append(confidenceToScore(tag['confidence']))
        num_imagga_tags = (len(all_tags)/2) - num_alchemy_tags

        if picture.has_key('machineTags'):
            tags = picture['machineTags']
            if tags:
                all_tags.append(tags[0]['tag'])
                all_tags.append(confidenceToScore(tags[0]['confidence']))
                if all_tags:
                    for tag in tags[1:]:
                        all_tags.append(tag['tag'])
                        all_tags.append(confidenceToScore(tag['confidence']))
        num_machine_tags = (len(all_tags)/2) - (num_alchemy_tags+num_imagga_tags)

        if num_imagga_tags + num_alchemy_tags + num_machine_tags > 0:
            csvout.writerow(all_tags)
        i += 1
        print i