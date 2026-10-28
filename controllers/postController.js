import PostSchema from '../models/post.js'
import { validationResult } from 'express-validator'
import { errorFallback } from '../utils/errorFallback.js'
import UserSchema from '../models/user.js'

class PostController {
  async create(req, res) {
    try {
      const { title, description, image, tags } = req.body
      const userId = req.userId

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
      }

      const user = await UserSchema.findById(userId)
      if (!user) {
        return errorFallback(res, 404, 'Пользователь не найден')
      }

      const post = new PostSchema({
        title: title,
        description: description,
        image: image,
        tags: tags,
        userId: userId,
      })

      const currentPost = await post.save()

      return res.json({
        currentPost,
        message: 'Пост успешно создан',
      })
    } catch (e) {
      console.log(e)
      return errorFallback(res, 500, 'Не удалось добавить пост')
    }
  }

  async getAll(req, res) {
    try {
      const posts = await PostSchema.find().select('-userId')

      return res.json({ posts })
    } catch (e) {
      console.log(e)
      return errorFallback(res, 500, 'Не удалось получить посты')
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params

      const currentPost = await PostSchema.findById(id)
      if (!currentPost) {
        return errorFallback(res, 404, 'Пост не найден')
      }

      return res.json(currentPost)
    } catch (e) {
      console.log(e)
      return res.json({
        message: 'Не удалось получить пост',
      })
    }
  }

  async patchById(req, res) {
    try {
      const { title, description, image, tags } = req.body
      const postId = req.params.id
      const userId = req.userId

      const newPost = await PostSchema.findByIdAndUpdate(
        { _id: postId, userId: userId },
        { title, description, image, tags },
        { new: true },
      )

      if (!newPost) {
        return errorFallback(res, 404, 'Пост не найден')
      }

      return res.json(newPost)
    } catch (e) {
      console.log(e)
      return res.json({
        message: 'Не удалось обновить пост',
      })
    }
  }

  async deleteById(req, res) {
    try {
      const postId = req.params.id

      const post = await PostSchema.findByIdAndDelete(postId)
      if (!post) {
        return errorFallback(res, 404, 'Пост не найден')
      }

      return res.json({
        message: 'Пост удален',
      })
    } catch (e) {
      console.log(e)
      return res.json({
        message: 'Не удалось удалить пост',
      })
    }
  }
}

export default new PostController()
