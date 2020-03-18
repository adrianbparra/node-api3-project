const express = require('express');

const postDb = require("./postDb.js");

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  postDb.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err=> res.status(500).json({message: "Unable to retrive posts"}))
});

router.get('/:id',validatePostId, (req, res) => {
  // do your magic!

  res.status(200).json(req.post);

});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  postDb.remove(req.post.id)
    .then(count => {
      res.status(200).json({countDelted: count, postDeleted: req.post})
    })
    .catch(err => res.status(500).json({errorMessage: "Unable to remove post."}))
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  if(req._body){
    if("text" in req.body){
      // res.status(200).json(req.body)
        postDb.update(req.post.id, req.body)
          .then(count => {
            res.status(201).json({postUpdate: count, ...req.post,...req.body})
          })
          .catch(err => res.status(500).json({message:"Unable to Update post!"}))
    } else {
      res.status(400).json({message: "Missing required text field"})
    }
  } else {
    res.status(400).json({message:"Missing post data"})
  }

});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const {id} = req.params;

  postDb.getById(id)
    .then(post=> {
      if(post){
        req.post = post
        next();
      } else {
        res.status(400).json({message: "Invalid Post ID"})
      }
    })
    .catch(err=> res.status(500).json(err))
}

module.exports = router;
