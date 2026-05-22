const express = require('express')
const router = express.Router();

const { findAllPosts, findPostById, findAllActivePostForUserId, createPost, putPost, patchPost, deletePostById } = require('../controllers/postController');

router.get('/', findAllPosts);
router.get('/active', findAllActivePostForUserId);
router.post('/', createPost)
router.put('/', putPost);
router.patch('/', patchPost)
router.delete('/:id', deletePostById);
router.get('/:id', findPostById)

module.exports = router;