import { validationResult } from 'express-validator'
import UserSchema from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

class AuthController {
  async register(req, res) {
    const errors = validationResult(req)
    try {
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
      }
      const password = req.body.password
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      const doc = new UserSchema({
        email: req.body.email,
        name: req.body.name,
        avatar: req.body.avatar,
        passwordHash: hash,
      })

      const user = await doc.save()

      const token = jwt.sign(
        {
          _id: user._id,
        },
        JWT_SECRET,
        {
          expiresIn: '30d',
        },
      )
      const { passwordHash, ...userData } = user._doc

      await res.json({ ...userData, token })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        message: 'Не удалось зарегистировалось',
      })
    }
  }

  async login(req, res) {
    try {
      const user = await UserSchema.findOne({ email: req.body.email })
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        })
      }

      const isValidPass = await bcrypt.compare(
        req.body.password,
        user._doc.passwordHash,
      )
      if (!isValidPass) {
        return res.status(400).json({
          message: 'Неверный логин или пароль',
        })
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        JWT_SECRET,
        {
          expiresIn: '30d',
        },
      )

      const { passwordHash, ...userData } = user._doc

      res.json({
        ...userData,
        token,
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        message: 'Не удалось войти',
      })
    }
  }

  async me(req, res) {
    try {
      const user = await UserSchema.findById(req.userId)

      if (!user) {
        return res.status(404).json({
          message: 'Пользнователь не найден',
        })
      }

      const { passwordHash, ...userData } = user._doc

      const token = jwt.sign(
        {
          _id: user._id,
        },
        JWT_SECRET,
        {
          expiresIn: '30d',
        },
      )
      
      res.json({
        ...userData,
        token,
      })
    } catch (e) {
      console.log(e)
    }
  }
}

export default new AuthController()
