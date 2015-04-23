import flickr
import urllib
import re
import numpy as np
import codecs
import timeit

flickr.API_KEY = '***'
flickr.API_SECRET = '***'
unused_tags = 'bldigital|publicdomain|mechanicalcurator|(sysnum|imagesfrombook|imagesfromvolume|vol|page)[0-9]+|dc:haspart=httpsflickrcomphotosbritishlibrary[0-9]+'

def get_page_photos_search(text, number_per_page, page_number):
    return flickr.photos_search(text=text, user_id='britishlibrary', per_page='%d' % number_per_page, page='%d' % page_number, sort='relevant')

def get_page_photos_tags(tags, number_per_page, page_number):
    return flickr.photos_search(tags=tags, user_id='britishlibrary', per_page='%d' % number_per_page, page='%d' % page_number, sort='relevant')

def get_page_photos_user(number_per_page, page_number):
    return flickr.photos_search(user_id='britishlibrary', per_page='%d' % number_per_page, page='%d' % page_number)

def download_photo(photo, filename):
    url = 'https://farm%s.staticflickr.com/%s/%s_%s_c.jpg' % (photo.farm, photo.server, photo.id, photo.secret)
    urllib.urlretrieve(url, filename)

def download_all_photos(photos, folder):
    for photo in photos:
        download_photo(photo, folder + '%s.jpg' % photo.id)

def number_of_photos_for_tags(tags):
    return int(flickr.photos_search_pages(tags=tags, user_id='britishlibrary', sort='relevant'))*100

def make_tag_file(filename, tag_list):
    f = codecs.open(filename, "w", "utf-8")
    lines = []
    for c in tag_list:
        lines.append(c + ',' + ','.join(tag_list[c]))
    f.write('\n'.join(lines))
    f.close()

def get_tags_all_photos(photos):
    tags_by_photo = {}
    i = 0
    for photo in photos:
        print i
        i += 1
        start = timeit.default_timer()
        tags_by_photo[photo.id] = [tag.text for tag in photo.tags]
        print timeit.default_timer() - start
    return tags_by_photo

def download_by_text(text, number_to_download, folder):
    if number_to_download <= 0:
        number_to_download = 1e20
    page_number = 1
    number_per_page = min(number_to_download, 500)
    current_page_photos = get_page_photos_search(text, number_per_page, page_number)
    download_all_photos(current_page_photos, folder)
    number_downloaded = len(current_page_photos)
    while len(current_page_photos) > 0 and (number_to_download <= 0 or number_downloaded < number_to_download):
        page_number += 1
        number_per_page = min(number_to_download - number_downloaded, 500)
        current_page_photos = get_page_photos_search(text, number_per_page, page_number)
        download_all_photos(current_page_photos, folder)
        number_downloaded += len(current_page_photos)

def download_by_tags(tags, number_to_download):
    if number_to_download <= 0:
        number_to_download = 1e20
    page_number = 1
    number_per_page = min(number_to_download, 500)
    current_page_photos = get_page_photos_tags(tags, number_per_page, page_number)
    download_all_photos(current_page_photos)
    number_downloaded = len(current_page_photos)
    while len(current_page_photos) > 0 and (number_to_download <= 0 or number_downloaded < number_to_download):
        page_number += 1
        number_per_page = min(number_to_download - number_downloaded, 500)
        current_page_photos = get_page_photos_tags(tags, number_per_page, page_number)
        download_all_photos(current_page_photos)
        number_downloaded += len(current_page_photos)

def all_tags_by_tags(tags, number_to_download):
    if number_to_download <= 0:
        number_to_download = 1e20
    page_number = 1
    number_per_page = min(number_to_download, 500)
    current_page_photos = get_page_photos_tags(tags, number_per_page, page_number)
    all_tags.append(get_tags_all_photos(current_page_photos))
    number_downloaded = len(current_page_photos)
    while len(current_page_photos) > 0 and (number_to_download <= 0 or number_downloaded < number_to_download):
        page_number += 1
        number_per_page = min(number_to_download - number_downloaded, 500)
        current_page_photos = get_page_photos_tags(tags, number_per_page, page_number)
        all_tags.append(get_tags_all_photos(current_page_photos))
        number_downloaded += len(current_page_photos)

def get_all_tags():
    number_downloaded = 0
    page_number = 1
    while number_downloaded < 1023705:
        print page_number
        current_page_photos = get_page_photos_user(500, page_number)
        make_tag_file('tags/page_%i.cvs' % page_number, get_tags_all_photos(current_page_photos))
        number_downloaded += len(current_page_photos)
        page_number += 1

all_tags = []
test_tags = {'bldigital', 'date1871', 'pubplace8london', 'publicdomain', 'sysnum000838883', 'large', 'vol0', 'page545', 'mechanicalcurator', 'imagesfrombook000838883', 'imagesfromvolume0008388830', 'color', 'editorialcartoon'}

def comparison_matrix(tag_list_saved):
    full_list = find_all_tags_from_list(tag_list_saved)
    number_photos = len(tag_list_saved)
    number_tags = len(full_list)
    comparison = np.zeros((number_tags, number_tags))
    for c in tag_list_saved:
        print c
        tag_list_new = remove_tags(tag_list_saved[c])
        for i in range(0, number_tags):
            matchi = [t for t in tag_list_new if t == full_list[i]]
            if len(matchi) > 0:
                for j in range(i + 1, number_tags):
                    matchj = [t for t in tag_list_new if t == full_list[j]]
                    if len(matchj) > 0:
                        comparison[i, j] += 1
    return full_list, comparison

def find_all_tags_from_list(tag_list_saved):
    tag_list = []
    for c in tag_list_saved:
        tag_list_new = remove_tags(tag_list_saved[c])
        for tag in tag_list_new:
            tag_list.append(tag)
    return list(set(tag_list))

def remove_tags(tag_list):
    pattern = re.compile(unused_tags)
    new_list = [tag for tag in tag_list if pattern.match(tag) == None]
    return new_list