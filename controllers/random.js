const got = require('got')
const express = require('express')
const cheerio = require('cheerio')
const config = require('../config')

function handleTitle(title, str, toEnd, num) {
	if (toEnd) {
		return title.slice(title.indexOf(str) + num)
	}
	return title.slice(0, title.indexOf(str))
}

module.exports = (req, res, next) => {
	const id = req.params.id
	const url = config.rootUrl + 'chaxun/shicirand/?i=' + id
	got(url)
    .then(response => {
    	const $ = cheerio.load(response.body)
    	const listStr = '/chaxun/list/'
    	const authorStr = '/chaxun/zuozhe/'
    	const title = $('h2 a').text()
    	// const titleHref = $('h2 a')[0].attribs.href
    	let titleHref = handleTitle($('h2 a')[0].attribs.href, listStr, 'toEnd', 12)
    		titleHref = '/poetry' + handleTitle(titleHref, '.html')
    	let year = $('.suijijjzz').text()
    	year = year.slice(3, year.indexOf('作者'))
    	let authorHref = handleTitle($('.suijijjzz a')[0].attribs.href, authorStr, 'toEnd', 14)
    		authorHref = '/author' + handleTitle(authorHref, '.html')
    	const author = $('.suijijjzz a').text()
    	const content = $('.suijineirong').text()
    	let allHref = titleHref
    	const result = {
    		title,
    		titleHref,
    		year,
    		authorHref,
    		author,
    		content,
    		allHref
    	}
    	res.json(result)
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...' 
    });
}