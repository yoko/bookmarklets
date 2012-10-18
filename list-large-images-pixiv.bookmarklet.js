// javascript:new function(s,d){d=document;s=d.createElement('script');s.charset='utf-8';s.src='https://raw.github.com/yoko/bookmarklets/master/list-large-images-pixiv.bookmarklet.js';d.body.appendChild(s)}
// @title     List Large Images (pixiv)
// @include   http://www.pixiv.net/*
// @license   MIT License

(function(w, d, $) {

var images = [], container;

$('img').each(function() {
	var src = this.dataset.src || this.src;
	// - /img/: サムネイル
	// - \d+_s: 削除、マイピク限定を除く
	if (!(src && (/\/i(mg)?\/[\w-]+\/\d+_s\.(?:jpg|png|gif)(?:\?\d+)?$/.test(src)))) return;

	images.push({
		target: this,
		src   : src.replace(/\_s(\.)/, '$1')
	});
});

if (!images.length) return;

container = $('\
<section class="ui-modal-container">\
	<div class="ui-modal-background" onclick="pixiv.modal.close()"></div>\
	<div class="ui-modal medium">\
		<div class="close" onclick="pixiv.modal.close()"></div>\
		<div class="content"><ul></ul></div>\
	</div>\
</section>\
').appendTo('body');
pixiv.modal.open(container, true);
container = $('ul', container);

(function find() {
	var img = images.shift();

	// mode=big で判定すると漫画の際に mode=medium と同じページが表示されるので mode=manga を見る
	$.get($(img.target).closest('a')[0].href.replace('mode=medium', 'mode=manga'))
		// エラーでも 200 が返るので常に done で受ける
		.done(function(data) {
			if (data.indexOf('指定されたIDは漫画ではありません') === -1) {
				console.log('maybe manga:', img.src);
				var urls = data
					.replace(/\s/g, '')
					.match(/http:\/\/i(mg)?\d+\.pixiv\.net\/img\/[\w-]+\/\d+_p\d+\.(?:jpg|png|gif)/g);
				add(urls);
			}
			else {
				console.log('maybe illustration:', img.src);
				add(img.src);
			}
		})
		.always(function() {
			images.length ?
				w.setTimeout(find, 1000) :
				$('<p>completed</p>').appendTo(container);
		});
})();

function add(urls) {
	urls = $.makeArray(urls);
	console.log(urls);
	for (var i = 0, url; url = urls[i]; ++i) {
		$('<li>' + url + '</li>').appendTo(container);
	}
}

})(this, document, jQuery);
