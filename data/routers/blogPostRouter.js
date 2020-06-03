const express = require('express');
const blogPostRouter = express.Router();
const db = require('../db');

blogPostRouter.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
  }
  db.insert(req.body)
    .then((post) => {
      res.status(201).json({ CREATED_POST: post });
    })
    .catch((error) => status(500).json({ error: 'There was an error while saving the post to the database' }));
});

blogPostRouter.post('/:id/comments', (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
  } else {
    db.findById(req.params.id)
      .then((post) => {
        if (post.length < 1) {
          res.status(404).json({ message: 'The post with the specified ID does not exist.' });
        } else {
          db.insertComment(req.body)
            .then((commentId) => {
              db.findCommentById(commentId.id).then((comment) => res.status(201).json({ CREATED: comment }));
            })
            .catch((err) =>
              res.status(500).json({ error: 'There was an error while saving the comment to the database' })
            );
        }
      })
      .catch((err) => console.log(err.message));
  }
});

blogPostRouter.get('/', (req, res) => {
  db.find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(500).json({ error: 'There was an error while saving the comment to the database' }));
});

blogPostRouter.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else if (post) {
        res.status(200).json(post);
      }
    })
    .catch((error) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

blogPostRouter.get('/:id/comments', (req, res) => {
  db.findPostComments(req.params.id)
    .then((comments) => res.status(200).json(comments))
    .catch((error) => console.log(error.message));
});

blogPostRouter.delete('/:id', (req, res) => {
  db.remove(req.params.id)
    .then((removed) => {
      if (removed === 1) {
        res.status(200).json({ POST_DELETED_WITH_ID: req.params.id, NUMBER_OF_ITEMS_REMOVED: removed });
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be modified.' }));
});

blogPostRouter.put('/:id', (req, res) => {
  const body = req.body;
  db.findById(req.params.id)
    .then((id) => {
      if (id.length < 1) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else if (!body.title || !body.contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
      } else {
        db.update(req.params.id, req.body)
          .then((updated) => res.status(201).json({ PUTTED: updated }))
          .catch((err) => res.status(500).json({ error: 'The post information could not be modified.' }));
      }
    })
    .catch((err) => console.log(error));
});

module.exports = blogPostRouter;
