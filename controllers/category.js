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

	const url = config.rootUrl + 'category/' + req.params.key + 'shiren'
	got(url)
    .then(response => {
    	const $ = cheerio.load(response.body)
    	const result = {title:'', list: []}
    	const title = handleTitle($('#niandai_title').text(),'大全')
    	result.title = title
    	const list = $('.shirenlist ul li a')
    	list.each(function(index, el) {
    		let href = handleTitle(el.attribs.href,'/chaxun/zuozhe/', 'toEnd')
            href = handleTitle(href, '.html')
    		result.list.push({
    			href: href,
    			name: el.children[0].data
    		})
    	});
    	res.render('category.html', result)
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...' 
    });
}