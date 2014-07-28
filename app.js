var _       = require('underscore')
  , request = require('request')
  , qs      = require('querystring')
  , express = require('express')
  , app     = express();

app.get('/tag/:name', function (request, response) {
  posts_for_tag(request.params.name, function (posts) {
    response.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With'
    });

    response.json(posts);
  });
});

function posts_for_tag (name, callback) {
  var query = qs.stringify({
    cout: 3,
    client_id: process.env.INSTAGRAM_CLIENT_ID
  });

  var url = 'https://api.instagram.com/v1/tags/' + name + '/media/recent?' + query;

  request(url, function (ig_error, ig_response, ig_body) {
    var posts = JSON.parse(ig_body).data;

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
