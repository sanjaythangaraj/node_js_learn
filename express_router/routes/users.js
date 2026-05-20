const express = require('express')
const router = express.Router();

const { getUsers, getUserById, createUser, putUser, patchUser, deleteUser} = require('../controllers/userController');

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', putUser);
router.patch('/:id', patchUser)
router.delete('/:id', deleteUser);

module.exports = router;