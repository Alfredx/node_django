from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.template.context_processors import csrf
from django.http import HttpResponse, JsonResponse
import redis
import random


def index(request):
    ctx = {}
    ctx['csrf_token'] = csrf(request).get('csrf_token')
    return render_to_response('index.html', RequestContext(request, ctx))


def channel_name(request):
    info = {
        'channel': '',
    }
    info['channel'] = 'channel_name_%d' % random.randint(0, 5)
    return JsonResponse(info, safe=False)


def node_api(request):
    try:
        channel_name = 'chatroom'
        r = redis.StrictRedis(host='localhost', port=6379, db=3)
        r.publish(channel_name, 'random str')
        return HttpResponse(200)
    except Exception, e:
        return HttpResponse(500)
