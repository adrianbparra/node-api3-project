const express = require('express');
const userDb = require("./userDb.js")
const postDb = require("../posts/postDb.js")

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!

  // res.status(200).json(req.body)
  userDb.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => res.status(500).json({err, errorMessage: "Unable to Add user"}))


});

router.post('/:id/posts', validatePost, (req, res) => {
  // do your magic!
  const {id} = req.params;

  postDb.insert({user_id: id,...req.body})
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => res.status(500).json({errorMessage: "Unable to add Post."}))
  /// no method in userDb to add post added from postDb

});

router.get('/', (req, res) => {
  // do your magic!
  userDb.get()
    .then( users => {
      res.status(201).json({users})
    })
    .catch(err => res.status(500).json({err, errorMessage:"Unable to retrieve Users"}))
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!

  res.status(201).json(req.user)

});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!

  // res.status(200).json(req.user.id)
  userDb.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => res.status(500).json({errorMessage: "Unable to retrieve users post"}))

});

router.delete('/:id',validateUserId, (req, res) => {
  // do your magic!
  userDb.remove(req.user.id)
    .then(count => {
      res.status(200).json({"recordsDelted": count, "userRemoved" : req.user})
    })
    .catch(err=> {
      res.status(500).json({errorMessage: "Unable to remove user.", err})
    })
});

router.put('/:id',validateUserId, validateUser, (req, res) => {
  // do your magic!
  userDb.update(req.user.id, req.body)
    .then(count => {
      res.status(201).json({recordsUpdated: count, ...req.user,...req.body})
    })
    .catch(err => res.status(500).json({errorMessage: "Unable to update user.",err}))

});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!

  const {id} = req.params;

  userDb.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next()
      }
      else {
        res.status(400).json({message:"Invalid User ID"})
      }
    })
    .catch(err=> res.status(500).json(err))


}

function validateUser(req, res, next) {
  // do your magic!
  // console.log(req)

  if(req._body) {
    const {name} = req.body;

    if(name){

      next()

    } else {
      res.status(400).json({message: "Missing required name field!"})
    }
    
    
  } else {
    res.status(400).json({message: "missing user data"})
  }

}

function validatePost(req, res, next) {
  // do your magic!
  if(req._body){
    const {text} = req.body;
    if(text){
      
      next()
    } else {
      res.status(400).json({message: "Missing required text field."})
    }

  } else{
    res.status(400).json({message: "Missing post data."})
  }
}

module.exports = router;

