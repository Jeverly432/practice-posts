import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import authRouter from './routes/authRouter.js'
import postRouter from './routes/postRouter.js'
import multer from 'multer'
import checkAuth from './utils/checkAuth.js'

const app = express()
const PORT = process.env.PORT
const MONGO = process.env.MONGO

app.use(express.json())

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })
app.use('/uploads', express.static('uploads'))
app.post('/api/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)

const start = () => {
  try {
    app.listen(PORT, (err) => {
      if (err) {
        return console.log(err)
      }
      console.log(`server started at ${PORT}`)
    })
    mongoose
      .connect(MONGO)
      .then(() => {
        console.log('DB OK')
      })
      .catch((err) => console.log(err))
  } catch (e) {
    console.error('Ошибка запуска сервера:', e.message)
  }
}

start()
