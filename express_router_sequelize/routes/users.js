const express = require('express')
const router = express.Router();

const { findAllUsers, findUserById, findAllMaleAndFemaleYoungAdultUsers, findUserByIdWithPosts, createUser, putUser, patchUser, deleteUserById} = require('../controllers/userController');

router.get('/', findAllUsers)
router.get('/mfya', findAllMaleAndFemaleYoungAdultUsers)
router.get('/:id', findUserById)
router.get('/:id/posts', findUserByIdWithPosts)
router.post('/', createUser)
router.put('/', putUser);
router.patch('/', patchUser)
router.delete('/:id', deleteUserById);

module.exports = router;