const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const moreRouter = require('./routes/more')
const methodOverride = require('method-override')
const upload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const path = require('path') 

const app = express()
app.use(upload({
  useTempFiles: true
}))
cloudinary.config({
  cloud_name: 'drvyjngdh',
  api_key: '445113726277837',
  api_secret: '9KNgMZlva35uVycz_0EgztEeExg'
})

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

mongoose.connect('mongodb+srv://KartikJaiswal:l13yFSWpb2YU1qR5@blog.smyeg.mongodb.net/MyBlogv2?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false })) // re.body.params wala kam krne ke liye
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/publicview', { articles: articles })
})

app.get('/articles', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})


app.use('/more', moreRouter)
app.use('/articles', articleRouter)

app.listen(port, () => {
  console.log('Server is up bro!')
})