###
@title     List Images (XVideos)
@include   http://www.xvideos.com/*
@license   MIT License
###

src = document.querySelector('img[border="1"]').src

sources = for n in [1..30] # displayFlash.js
  src.replace /\d+(\.jpg)$/, "#{n}$1"

images = for src in sources
  "#{src}\n<img src=\"#{src}\">\n"

if images.length
  document.body.outerHTML = "<body>#{images.join ''}</body>"
else
  alert "Image Not Found"
