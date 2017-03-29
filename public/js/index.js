$(document).ready(function () {
	// 处理搜索
	$('.search_btn').on('click', function () {
		window.location.href = '/search/' + $('.search_txt').val()	
	})
	$('.random').on('click', '.change', changePoetry)
	function changePoetry () {
		$.get("/shici/random/"+Math.floor(Math.random()*10000+1), function (data, status) {
			if (status == 'success') {
				let str = data.content
				str = str.replace(/，/g, '，<br>')
				str = str.replace(/。/g, '。<br>')
				$('.random').html(template('tpl', data))
				$('.random .content').html(str)
			}
		});
	}
	changePoetry()
})