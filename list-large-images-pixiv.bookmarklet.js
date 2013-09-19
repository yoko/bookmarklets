// javascript:new function(s,d){d=document;s=d.createElement('script');s.charset='utf-8';s.src='https://raw.github.com/yoko/bookmarklets/master/list-large-images-pixiv.bookmarklet.js';d.body.appendChild(s)}
// @title     List Large Images (pixiv)
// @include   http://www.pixiv.net/*
// @license   MIT License

(function(w, d, $) { 'use strict';

var completed = false;
var container = $('\
<div class="introduction-modal-container" style="display:block;">\
<section class="introduction-modal">\
<div class="close" onclick="pixiv.modal.close()"></div>\
<ul></ul>\
</section>\
</div>\
').appendTo('body');
pixiv.ui.modal.push(container, {block: true});

container = $('ul', container);
var url = location.href,
	page = $('.pager-container').length ? 1 : 0,
	latest_id = w.prompt('latest id:');

(function loop() {
	$.get(url, page ? {p: page} : null).then(function(html) {
		var images = [];
		$(html).find('img').each(function() {
			// 1. http://i\d+\.pixiv\.net/img-inf/img/\d{4}/\d{2}/\d{2}/\d{2}/\d{2}/\d{2}/\d+_s\.(jpg|png|gif)
			// 2. http://i\d+\.pixiv\.net/img\d+/img/[\w-]+/\d+_s\.(jpg|png|gif)
			var src = this.dataset.src || this.src,
				m = /(\d+)_s\.(?:jpg|png|gif)(?:\?\d+)?$/.exec(src);
			if (!m) return;
			if (m[1] === latest_id) {
				completed = true;
				return false;
			}
			images.push(this);
		});
		if (!images.length) return;

		console.log('images', images);
		findImage(images, page).then(function() {
			if (!page || !latest_id || completed) {
				console.log('completed');
				$('<p>completed</p>').appendTo(container);
			}
			else {
				console.log('next page');
				++page;
				loop();
			}
		});
	});
})();

function findImage(images, page) {
	return (function loop() {
		var target = $(images.shift()),
			url = target.closest('a').attr('href'),
			src = target.dataset('src') || target.attr('src');

		function next() {
			if (images.length) {
				return loop();
			}
			else {
				console.log('completed page ' + page);
			}
		}

		return wait(1000).then(function() {
			console.log('findImage', url);
			// mode=bigで判定すると漫画の際にmode=mediumと同じページが表示されるのでmode=mangaを見る
			return $.get(url.replace('mode=medium', 'mode=manga')).then(
				// エラーでも200が返るので常にdoneで受ける
				function(html) {
					if (html.indexOf('指定されたIDは漫画ではありません') === -1) {
						console.log('maybe manga:', src);
						add(findMangaURL(html));
						return next();
					}
					else {
						console.log('maybe illustration:', src);
						if (oldImage(src)) {
							add(src.replace(/_s(\.)/, '$1'));
							return next();
						}
						else {
							return wait(1000).then(function() {
								return $.get(url).then(function(html) {
									add(findURL(html));
									return next();
								});
							});
						}
					}
				},
				function() {
					console.log('error', src);
					return next();
				}
			);
		});
	})();
}

function oldImage(src) {
	return /\/img\d+\/img\/[\w-]+\/\d+_s\.(?:jpg|png|gif)/.test(src);
}

function findURL(text) {
	var urls = text
		.replace(/\s/g, '')
		.match(/http:\/\/i\d+\.pixiv\.net\/img\d+\/img\/[\w-]+\/\d+_m?\.(?:jpg|png|gif)/g);
	urls = urls.map(function(url) {
		return url.replace(/_m(\.)/, '$1');
	});
	console.log('findURL', urls);
	return urls;
}

function findMangaURL(text) {
	var urls = text
		.replace(/\s/g, '')
		.match(/http:\/\/i\d+\.pixiv\.net\/img\d+\/img\/[\w-]+\/\d+_p\d+\.(?:jpg|png|gif)/g);
	console.log('findMangaURL', urls);
	return urls;
}

function add(urls) {
	urls = $.makeArray(urls);
	console.log(urls);
	for (var i = 0, url; url = urls[i]; ++i) {
		$('<li>' + url + '</li>').appendTo(container);
	}
}

function wait(time) {
	var d = $.Deferred();
	setTimeout(function() {
		d.resolve();
	}, time);
	console.log('waiting', time, new Date().getMilliseconds());
	return d;
}

})(this, document, jQuery);
