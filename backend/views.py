# -*- coding: utf-8 -*-
# author: ShenChao
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.template.context_processors import csrf
from django.http import HttpResponse, JsonResponse
import redis
import random
import json


def index(request):
    ctx = {}
    ctx['csrf_token'] = csrf(request).get('csrf_token')
    return render_to_response('index.html', RequestContext(request, ctx))


def get_post_args(request, *args):
    try:
        args_info = json.loads(request.body)
    except Exception, e:
        args_info = {}

    return [request.POST.get(item, None) or args_info.get(item, None) for item in args]


import sys

def get_data(request):
    data = {
        'data1': 123,
        'data2': 'abc',    
    }
    return JsonResponse(data, safe=False)


def post_data(request):
    data1, data2 = get_post_args(request, 'data1', 'data2')
    response = {
        'status': 'success',
        'data1': data1,
        'data2': data2,
    }
    return JsonResponse(response, safe=False)

def channel_name(request):
    info['channel'] = 'channel_name_%d' % random.randint(0, 1)
    return JsonResponse(info, safe=False)

def node_api(request):
    try:
        channel_name, msg = get_post_args(request, 'channel_name', 'msg')
        r = redis.StrictRedis(host='localhost', port=6379, db=3)
        r.publish(channel_name, msg)
        return HttpResponse(200)
    except Exception, e:
        return HttpResponse(500)
