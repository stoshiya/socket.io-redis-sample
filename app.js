
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , opts = require('opts')
  , config = require('config');

opts.parse([{ short: 'p', long: 'port', description: 'server listen port.', value: true }]);

var app = express();

app.configure(function(){
  app.set('port', opts.get('port') || process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

var RedisStore = require('socket.io/lib/stores/redis')
  , redis = require('socket.io/node_modules/redis')
  , pub = redis.createClient()
  , sub = redis.createClient()
  , client = redis.createClient();

pub.on('error', function(err) {
  console.log('pub:', err);
});
sub.on('error', function(err) {
  console.log('sub:', err);
});
client.on('error', function(err) {
  console.log('client:', err);
});

if (typeof config.redis !== 'undefined' && typeof config.redis.password !== 'undefined') {
  pub.auth(config.redis.password, function(err) { if (err) throw err; });
  sub.auth(config.redis.password, function(err) { if (err) throw err; });
  client.auth(config.redis.password, function(err) { if (err) throw err; });
}

io.set('store', new RedisStore({
  redis: redis,
  redisPub: pub,
  redisSub: sub,
  redisClient: client
}));

io.sockets.on('connection', function(socket) {
  console.log(io.transports[socket.id].name);

  socket.on('message', function(data) {
    socket.broadcast.emit('message', data);
  });
});
