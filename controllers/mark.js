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
    req.params.key= req.params.key === 'songbieshi'? 'sonbieshi': req.params.key
	req.params.key= req.params.key === 'miaoxiexiatian'? 'miaoxiexiatiantian': req.params.key
	const url = config.rootUrl + 'shicimark/' + req.params.key + '.html'
	got(url)
    .then(response => {
    	const $ = cheerio.load(response.body)
    	const result = {title:'', list: []}
    	const listStr = '/chaxun/list/'
    	const yearStr = 'shiren'
    	const authorStr = '/chaxun/zuozhe/'
    	result.title = handleTitle($('#shuaixuan').text(), '(')
    	const lis = $('#middlediv .shicimark').children('ul').children('li')
    	lis.each(function(index, el) {
    			const hrefs = $(el).find('a')
    			// 处理a链接的href
    			let href = handleTitle(hrefs[0].attribs.href, listStr, 'toEnd', 12)
    			href = handleTitle(href, '.html')
    			let authorHref = handleTitle(hrefs[1].attribs.href, authorStr, 'toEnd', 14)
    			authorHref = handleTitle(authorHref, '.html')
    			const yearHref = handleTitle(hrefs[2].attribs.href, yearStr)
    			const des = $(el).children('.des').text()
    			result.list.push({
    				titleHref: href,
    				title: hrefs.eq(0).text(),
    				yearHref: yearHref,
    				year:  hrefs.eq(2).text(),
    				authorHref: authorHref,
    				author:  hrefs.eq(1).text(),
    				des: des
    			})	
    	});
    	res.render('mark.html', result)
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...' 
    });
}