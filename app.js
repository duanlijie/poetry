const express = require('express')
const got = require('got')
const path = require('path')
const nunjucks = require('nunjucks')
const config = require('./config')
const router = require('./routes/route')

const app = express()

// 配置静态资源
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))

// 配置nunjucks模板引擎
nunjucks.configure(config.viewPath, {
  autoescape: true,
  express: app,
  watch: true,
  noCache: false
})

app.use(router)

app.listen(config.port, config.host, (err) => {
	if (err) {
		throw err
	}
	console.log(`running at ${config.port}端口`)
})