import json
import urllib
import os

with open('images.json') as json_file:
    l = 0
    for line in json_file:
        print l
        image = json.loads(line)
        try:
            urllib.urlretrieve(image['flickr_medium_source'], os.path.abspath('../data/images/') + image['flickr_id'].values()[0] + '.jpg')
        except:
            print 'Error'
        l += 1