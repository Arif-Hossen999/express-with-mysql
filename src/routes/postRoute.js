const express = require('express');
const router = express.Router();

// import post controller
const postController = require('../controllers/postController');
// import post validator
const {postValidator, postValidatorMsg} = require('../validation/postValidation');

// get all post 
router.get('/', postController.getPostList);
// get single post by id
router.get('/:id', postController.getPostById);
// create new post
router.post('/',  postValidator, postValidatorMsg, postController.createNewPost);
// update post
router.put('/:id', postController.postUpdate);
// delete post
router.delete('/:id', postController.deletePost);
// update status for delete post
router.put('/update/status/:id', postController.postUpdateStatus);

module.exports = router;