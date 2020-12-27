 
const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
const upload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const app = express()
app.use(upload({
  useTempFiles: true
}))
cloudinary.config({
  cloud_name: 'drvyjngdh',
  api_key: '445113726277837',
  api_secret: '9KNgMZlva35uVycz_0EgztEeExg'
})

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/articles')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    try {
      const file = req.files.file
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      let article = new Article ({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        image: result.url 
      })
      await article.save();
      res.redirect(`/articles/${article.slug}`)
    } catch (err) {
      console.log(err)
    }

  }
}

// function saveArticleAndRedirect(path) {
//   return async (req, res) => {
//     let article = req.article
//     article.title = req.body.title
//     article.description = req.body.description
//     article.markdown = req.body.markdown
//     const file = req.files.file
//     const result = await cloudinary.uploader.upload(file.tempFilePath);

//     try {
//       article = await article.save()
//       res.redirect(`/articles/${article.slug}`)
//     } catch (e) {
//       res.render(`articles/${path}`, { article: article })
//     }
//   }
// }

module.exports = router