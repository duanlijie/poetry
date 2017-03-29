const got = require('got')
const express = require('express')
const cheerio = require('cheerio')
const config = require('../config')

function handleTitle(title, str, toEnd) {
	if (toEnd) {
		return title.slice(title.indexOf(str) + 14)
	}
	return title.slice(0, title.indexOf(str))
}

module.exports = (req, res, next) => {

	const url = config.rootUrl + 'chaxun/list/' + req.params.key + '.html'
	const yearStr = 'shiren'
    const authorStr = '/chaxun/zuozhe/'
	got(url)
    .then(response => {
    	const $ = cheerio.load(response.body)
    	

    	const title = $('#middlediv .zhuti h2').text() //标题
		const year = $('#middlediv .zhuti .jjzz a').first().text() //年代
		const yearHref = handleTitle($('#middlediv .zhuti .jjzz a').first()[0].attribs.href, yearStr)
		const author = $('#middlediv .zhuti .jjzz a').last().text() //作者
		let authorHref = handleTitle($('#middlediv .zhuti .jjzz a').last()[0].attribs.href, authorStr, 'toEnd', 14)
    		authorHref = handleTitle(authorHref, '.html')
		const content = $('#shicineirong').html() //内容	
		const appreciation = $('#middlediv .shangxi').html() // 赏析内容
		const about_author = $('#middlediv .shangxi .zuozhe').html()
		const result = {
			title: title,
			year: year,
			yearHref: yearHref,
			author: author,
			authorHref: authorHref,
			content: content,
			appreciation: appreciation,
			about_author: about_author
		}
    	res.render('poetry.html', result)
    	// res.json(result)
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...' 
    });
}