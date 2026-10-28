import { body } from "express-validator"; 

export const postsValidation = [
  body('title', 'Неверный формат почты').isLength({min:3}),
  body('description', 'Заполните описание').isLength({min:5}),
  body('tags').isLength({min:1}),
  body('image').isURL()
]