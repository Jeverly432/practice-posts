import { body } from "express-validator"; 

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Неверный ').isLength({min:5}),
  body('name').isLength({min:3}),
  body('avatar').optional().isURL()
]