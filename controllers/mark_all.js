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
	const url = config.rootUrl + 'shicimark/'
	got(url)
    .then(response => {
    	const $ = cheerio.load(response.body)
    	const result = {title:'全部标签', list: []}
    	const markStr = '/shicimark/'
    	const links = $('#middlediv .shicimark a')
    	links.each(function(index, el) {
			let href = handleTitle(el.attribs.href, markStr, 'toEnd', 11)
			href = '/mark/' + handleTitle(href, '.html')
			href = href === '/mark/sonbieshi'? '/mark/songbieshi': href;
			href = href === '/mark/miaoxiexiatiantian'? '/mark/miaoxiexiatian': href;
			result.list.push({
				href: href,
				name: $(el).text()
			})		
    	});
    	res.render('mark_all.html', result)
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...' 
    });
}