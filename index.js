//import express
const express = require('express');

// use express
const server = express();

//express can read json
server.use(express.json());

server.get('/', (req, res) => {
  res.send({ message: 'Backend Node project 2' });
});

const blogPostRouter = require('./data/routers/blogPostRouter');
server.use('/api/posts', blogPostRouter);
port = 6000;
server.listen(port, () => {
  console.log('\n*** Server Running on http://localhost:6000 ***\n');
});
