const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category')
const authorController = require('../controllers/author')
const poetryController = require('../controllers/poetry')
const markController = require('../controllers/mark')
const searchController = require('../controllers/search')
const markAllController = require('../controllers/mark_all')
const randomController = require('../controllers/random')

router
	.get('/',(req, res, next) => {
		res.render('index.html')
	})
	.get('/category/:key', categoryController)
	.get('/author/:id', authorController)
	.get('/poetry/:key', poetryController)
	.get('/mark/:key', markController)
	.get('/search/:key', searchController)
	.get('/search/:position/:key', searchController)
	.get('/mark', markAllController)
	.get('/shici/random/:id', randomController)

module.exports = router