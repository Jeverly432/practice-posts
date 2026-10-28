import { Router } from "express";
import authController from "../controllers/authController.js";
import { registerValidation } from "../validations/auth.js";
import checkAuth from '../utils/checkAuth.js'

const router = Router()

router.post('/register',registerValidation,authController.register)
router.post('/login', authController.login)
router.get('/me', checkAuth, authController.me)

export default router;
