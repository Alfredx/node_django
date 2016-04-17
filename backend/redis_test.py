import redis

r = redis.StrictRedis(host='localhost', port=6379)
#publish
r.publish('test_channel', 'python data published to test_channel');
#subscribe
sub = r.pubsub()
sub.subscribe('test_channel')
for item in sub.listen():  
    if item['type'] == 'message':  
        print(item['data'])