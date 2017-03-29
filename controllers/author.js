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

	const url = config.rootUrl + 'chaxun/zuozhe/' + req.params.id + '.html'
	got(url)
    .then(response => {
    	const $ = cheerio.load(response.body)
    	const result = {title:'', list: []}
    	const listStr = '/chaxun/list/'
    	const yearStr = 'shiren'
    	const authorStr = '/chaxun/zuozhe/'
    	result.title = handleTitle($('#middlediv .jianjie a').text(),'全集')
    	const uls = $('.shicilist ul')
    	uls.each(function(index, el) {
    			// const hrefs = $(el).children('li').first().children('a')
    			const hrefs = $(el).find('a')
                const shicilist_zz = $(el).find('.shicilist_zz').children('a')
    			// 处理a链接的href
    			let href = handleTitle(hrefs[0].attribs.href, listStr, 'toEnd', 12)
    			href = handleTitle(href, '.html')
    			let authorHref = handleTitle(shicilist_zz[1].attribs.href, authorStr, 'toEnd', 14)
    			authorHref = handleTitle(authorHref, '.html')
    			const yearHref = handleTitle(shicilist_zz[0].attribs.href, yearStr)
    			const des = $(el).children('.des').text()
    			result.list.push({
    				titleHref: href,
    				title: hrefs.eq(0).text(),
    				yearHref: yearHref,
    				year: shicilist_zz.eq(0).text(),
    				authorHref: authorHref,
    				author: shicilist_zz.eq(1).text(),
    				des: des
    			})	
    	});
    	res.render('author.html', result)
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...' 
    });
}