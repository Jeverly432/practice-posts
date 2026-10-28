import { Router } from 'express'
import checkAuth from '../utils/checkAuth.js'
import postController from '../controllers/postController.js'
import { postsValidation } from '../validations/post.js'

const router = Router()

router.post('/create', checkAuth, postsValidation, postController.create)
router.get('/all', checkAuth, postController.getAll)
router.get('/:id', checkAuth, postController.getById)
router.delete('/:id', checkAuth, postController.deleteById)
router.patch('/:id', checkAuth, postController.patchById)

export default router
