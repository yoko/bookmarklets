###
@title     Clip Images (DMM)
@include   http://www.dmm.com/
@include   http://www.dmm.co.jp/
@license   MIT License
###

# DMM
# - Array.reduce を独自に prototype 拡張していて、しかも機能が違う（ .com のみ）
#   - Array.reduceRight は生きているので array.reverse().reduceRight する
# - .com は Prototype.js
# - .no.jp は jQuery


sources = []
has_large_image = !!document.querySelector("#sample-image-block > a")?.id
filter = (src) ->
  if /^http:\/\/pics\.dmm\.(?:co\.jp|com)\//.test src
    has_large_image and src = src.replace /(\-\d+\.jpg)$/, "jp$1"
    src.replace /p[st](\.jpg)$/, "pl$1"
  else
    undefined


process = ->
  sources = sources.reverse().reduceRight (a, b) ->
    if b and a.indexOf(b) is -1 then a.concat b else a
  , []

  images = for src in sources
    "<img src=\"#{src}\">"

  if images.length
    document.body.outerHTML = "<body>#{location.href}#{images.join ''}</body>"
  else
    alert "Image Not Found"

add_linked_image = ->
  add(a.href for a in document.links)

add_image = ->
  add(img.src for img in document.images)

add = (target) ->
  items = Array.prototype.slice.call(target).filter (item) ->
    /.+\.(?:jpe?g|gif|png|svg|bmp)$/.test item
  sources = sources.concat if filter then items.map(filter) else items


add_image()
add_linked_image()
process()
