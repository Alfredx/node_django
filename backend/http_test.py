#!/usr/bin/env python
#coding=utf8
 
import urllib
import urllib2
 
httpClient = None
try:
    headers = {"Content-type": "application/x-www-form-urlencoded", 
               "Accept": "text/plain"}
    data = urllib.urlencode({'post_arg1': 'def', 'post_arg2': 456})
    get_request = urllib2.Request('http://localhost:9000/node_get_data/', headers=headers)
    get_response = urllib2.urlopen(get_request)
    get_plainRes = get_response.read().decode('utf-8')
    print(get_plainRes)
    post_request = urllib2.Request('http://localhost:9000/node_post_data/', data, headers)
    post_response = urllib2.urlopen(post_request)
    post_plainRes = post_response.read().decode('utf-8')
    print(post_plainRes)
except Exception, e:
    print e
