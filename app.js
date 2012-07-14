var connect = require('connect')
  , http = require('http')
  , routing = require('./routing.js');

var testRoute = function(){
  return 'test route';
}

var testRouteWithData = function(data){
  return JSON.stringify(data);
}

var routes = {
  '/test/':testRoute,
  '/test/:id':testRouteWithData
};

var app = connect()
  .use(function(req, res){
    routing.Router(req, res, routes);
  });


http.createServer(app).listen(3000);
