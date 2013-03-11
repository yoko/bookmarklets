// javascript:new function(s,d){d=document;s=d.createElement('script');s.charset='utf-8';s.src='https://raw.github.com/yoko/bookmarklets/master/facebook-like.bookmarklet.js';d.body.appendChild(s)}
// @title     Facebook Like
// @include   *
// @license   MIT License

(function(w, d) {

var url = location.href;
w.open(
	'http://yoko.github.com/bookmarklets/facebook-like.html#' + url,
	null
);

})(this, document);
