###
@title     List Large Images (pixiv)
@include   http://www.pixiv.net/*
@license   MIT License
###

"use strict"

$ = jQuery

sources = []

$('img').each ->
  src = this.dataset.src || this.src
  return unless src and /\/img\/.+\/\w+_s\.jpg$/.test src
  
  sources.push src.replace /_s(\.jpg)$/, "$1"

pixiv.modal.open($("""
<section class="create-group-modal ui-modal-container">
	<div class="ui-modal-background" onclick="pixiv.modal.close()"></div>
	<div class="ui-modal medium">
		<div class="close" onclick="pixiv.modal.close()"></div>
		<div class="content">
		  <pre>#{sources.join "\n"}</pre>
		</div>
	</div>
</section>
""").appendTo "body", true)
