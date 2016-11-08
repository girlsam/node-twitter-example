const debug = require('debug')('sockettest:server');
const http = require('http');

const port = '3000';
const app = require('./app');
const Twitter = require('twitter');
const config = require('./_config');

const server = app.listen(3000, () => {
  console.log('The server is listening on port 3000');
});

const io = require('socket.io').listen(server);

const client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

const hashtags = '#Trump, #Hillary';

client.stream('statuses/filter', {track: hashtags}, (stream) => {
  stream.on('data', (tweet) => {
    //console.log(tweet.user.profile_image_url);
    io.emit('newTweet', tweet);
  });
  stream.on('error', (error) => {
    throw error;
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
