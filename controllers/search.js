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
	const title = req.params.title
	const content = req.params.content
	const position = req.params.position
	const key = req.params.key
	let url
	if (position && position === 'start') {
		url = config.rootUrl + 'chaxun/shiju/first/' + encodeURI(key)
	}else if (position && position === 'end') {
		url = config.rootUrl + 'chaxun/shiju/end/' + encodeURI(key)
	}else if (position && position === 'title') {
		url = config.rootUrl + 'chaxun/shici/' + encodeURI(key)
	}else if (position && position === 'content') {
		url = config.rootUrl + 'chaxun/shiju/' + encodeURI(key)
	}else {
		url = config.rootUrl + 'chaxun/all/' + encodeURI(key)
	}
	// const url = config.rootUrl + 'chaxun/all/' + encodeURI(key)
	got(url)
    .then(response => {
    	const $ = cheerio.load(response.body)
    	const result = []
    	const listStr = '/chaxun/list/'
    	const yearStr = 'shiren'
    	const authorStr = '/chaxun/zuozhe/'
    	const startStr = '/chaxun/shiju/first/'
    	const endStr = '/chaxun/shiju/end/'
    	const shiciStr = '/chaxun/shici/'
    	const shijuStr = '/chaxun/shiju/'
    	let allList
    	if (position) {
    		allList = $('#shijulist a')
    	}else {
    		allList = $('#alllist a')
    	}
    	allList.each(function(index, el) {

    		if (el.attribs.href.indexOf(listStr) === 0) {
    			let href = handleTitle(el.attribs.href, listStr, 'toEnd', 12)
    			href = handleTitle(href, '.html')
    			el.attribs.href = '/poetry' + href
    		}

    		if (el.attribs.href.indexOf('/category/') === 0) {
    			let yearHref = handleTitle(el.attribs.href, yearStr)
    			el.attribs.href = yearHref
    		}
    		if (el.attribs.href.indexOf(authorStr) === 0) {
    			let authorHref = handleTitle(el.attribs.href, authorStr, 'toEnd', 14)
    			authorHref = handleTitle(authorHref, '.html')
    			el.attribs.href = '/author' + authorHref
    		}
    		if (el.attribs.href.indexOf(startStr) === 0) {
    			let startHref = handleTitle(el.attribs.href, startStr, 'toEnd', 19)
    			el.attribs.href = '/search/start' + startHref
    		}
    		if (el.attribs.href.indexOf(endStr) === 0) {
    			let endHref = handleTitle(el.attribs.href, startStr, 'toEnd', 18)
    			el.attribs.href = '/search/end' + endHref
    		}
    		if (el.attribs.href.indexOf(shiciStr) === 0) {
    			let startHref = handleTitle(el.attribs.href, startStr, 'toEnd', 13)
    			el.attribs.href = '/search/title' + startHref
    		}
    		if (el.attribs.href.indexOf(shijuStr) === 0) {
    			let endHref = handleTitle(el.attribs.href, startStr, 'toEnd', 14)
    			el.attribs.href = '/search/content' + endHref
    		}
    	});
    	// res.send($('#alllist').html())
    	let data
    	if (position) {
    		$('.select_niandai').remove()
    		$('.num').remove()
    		$('.lastsearch').remove()
    		if (position === 'start') {
    			const h3 = $('<h3>以'+ key +'开始的诗</h3>')
    			$('#shijulist').prepend(h3)
    		}else if (position === 'end') {
    			const h3 = $('<h3>以'+ key +'结尾的诗</h3>')
    			$('#shijulist').prepend(h3)
    		}else if (position === 'title') {
    			const h3 = $('<h3>标题中包含'+ key +'的诗</h3>')
    			$('#shijulist').prepend(h3)
    		}else if (position === 'content') {
    			const h3 = $('<h3>内容中包含'+ key +'的诗</h3>')
    			$('#shijulist').prepend(h3)
    		}
    		data = $('#shijulist').html()
    	}else {
    		data = $('#alllist').html()
    	}
    	res.render('search.html', {
    		data: data
    	})
    })
    .catch(error => {
        console.log(error);
        //=> 'Internal server error ...' 
    });
}

// function handleData (el, result) {
// 	let href = handleTitle(el[0].attribs.href, listStr, 'toEnd', 12)
// 	href = handleTitle(href, '.html')
// 	let authorHref = handleTitle(hrefs[1].attribs.href, authorStr, 'toEnd', 14)
// 	authorHref = handleTitle(authorHref, '.html')
// 	const yearHref = handleTitle(hrefs[2].attribs.href, yearStr)
// 	const des = $(el).children('.des').text()
// 	result.list.push({
// 		titleHref: href,
// 		title: hrefs.eq(0).text(),
// 		yearHref: yearHref,
// 		year:  hrefs.eq(2).text(),
// 		authorHref: authorHref,
// 		author:  hrefs.eq(1).text(),
// 		des: des
// 	})
// }