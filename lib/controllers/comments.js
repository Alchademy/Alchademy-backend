const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Comment = require('../models/Comment');

module.exports = Router()
  .get('/:type/:id', authenticate, async (req, res, next) => {
    try {
      const comments = await Comment.getAllCommentsPerRecord(req.params.id, req.params.type);
      res.json(comments);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const singleComment = await Comment.getSingleComment(req.params.id);
      res.json(singleComment);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, async (req, res) => {
    const allComments = await Comment.getAll();
    res.json(allComments);
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      const newComment = await Comment.create(req.body);
      res.json(newComment);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const deletedComment = await Comment.delete(req.params.id);
      res.json(deletedComment);
    } catch (e) {
      next(e);
    }
  });
