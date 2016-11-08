const twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {

  socket.on('newTweet', function (tweet) {
    $scope.tweet = tweet.text;
    $scope.user = tweet.user.screen_name;
    $scope.photo = tweet.user.profile_image_url;
    //parse source from payload
    var source = tweet.source.split('>')[1].split('<')[0].split(' ')[2];
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase();
    });
    //console.log('hashtags',hashtags);
    //console.log('scope', $scope);
    //check source and increment for #trump tweets
    if (hashtags.includes('trump')) {
      $scope.trump = tweet.user.profile_image_url;
    }
    //check source and increment for #strongertogether tweets
    else if (hashtags.includes('hillary')) {
      $scope.hillary = tweet.user.profile_image_url;
    }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
