var connect = require('connect')
  , http = require('http');

var testRoute = function(){
  return 'test route';
}

var testRouteWithData = function(data){
  return JSON.stringify(data);
}

var RemoveSpaces = function(array){
  for(var i = 0; i < array.length; i++){
    if(array[i] == ""){
      array.splice(i, 1);
    }
  }
  return array;
}

var DetectRoute = function(routes, url){
    console.log("Detecting Route for URL: " + url);
    for(var key in routes){
      routeParams = key.split('/');
      routeParams = RemoveSpaces(routeParams);
      for( var i = 0; i < routeParams.length; i++){
        if(url.indexOf(routeParams[i]) != -1){
          urlParams = url.split('/');
	  urlParams = RemoveSpaces(urlParams);
          if(urlParams.length == routeParams.length){
            return { route : key, data : url };
          }
        }
      }        
    }

}

var RetrieveData = function(route, url){
  if(route.indexOf(':') != -1){
    data = new Object();
    routePieces = route.split('/');
    dataPieces = url.split('/');
    for( var i=0; i < routePieces.length; i++){
      if(routePieces[i].indexOf(':')  != -1){
        data[routePieces[i].replace(/:/g, "")] = dataPieces[i];
      }
    }
    return data;
  }
  else{
    return;
  }
}

var routes = {
  '/test/':testRoute,
  '/test/:id':testRouteWithData
};

var app = connect()
  .use(function(req, res){
  try{
    if(req.url == '/favicon.ico'){
      return;
    }
    var object = DetectRoute(routes, req.url);
    console.log("Matched route results: " + JSON.stringify(object));
    var data = RetrieveData(object.route, object.data);
    console.log("Route data pulled: " + JSON.stringify(data));
    if(data != undefined){
      console.log("firing data route");
      var ret = routes[object.route](data);
      res.end(ret);
    }
    else{
      console.log('Firing dataless route');
      var ret = routes[object.route]();
      res.end(ret);
    }
  }
  catch(err){
    res.end('Error Route not detected\n');
  }
  });


http.createServer(app).listen(3000);
