var _       = require('underscore')
  , request = require('request')
  , qs      = require('querystring')
  , express = require('express')
  , app     = express();

app.all('*', function (request, response, next) {
  response.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  });

  next();
});

app.get('/tag/:name', function (request, response) {
  posts_for_tag(request.params.name, function (posts) {
    response.json(posts);
  });
});

function posts_for_tag (name, callback) {
  var query = qs.stringify({
    client_id: process.env.INSTAGRAM_CLIENT_ID
  });

  var url = 'https://api.instagram.com/v1/tags/' + name + '/media/recent?' + query;

  request(url, function (error, response, body) {
    var posts = JSON.parse(body).data;

    var results = _(posts).map(function (post) {
      return {
        link: post.link,
        image: post.images['standard_resolution'].url
      };
    });

    callback(results);
  });
}

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on port " + port);
});
