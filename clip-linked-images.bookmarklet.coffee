###
@title     Clip Linked Images
@include   http://*
@include   https://*
@license   MIT License
###


sources = []
filter = null


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

add = (target) ->
  items = Array.prototype.slice.call(target).filter (item) ->
    /.+\.(?:jpe?g|gif|png|svg|bmp)$/.test item
  sources = sources.concat if filter then items.map(filter) else items


add_linked_image()
process()
