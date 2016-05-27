#helpers
ready = (script) ->
	if document.readyState != 'loading'
		script
	else
		document.addEventListener 'DOMContentLoaded', script

#common
ready ->
	el = document.getElementById 'el'
	lastScroll = 0
	hue = null

	getRandomColor = ->
		hue = Math.round(Math.random() * (999 - 111) + 111)

	getRandomColor()

	window.onscroll = ->
		documentHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		)
		currentScroll = window.pageYOffset
		scrollHeight = documentHeight - document.documentElement.clientHeight

		#move
		el.style.top = currentScroll + 'px'

		#radius
		el.style.borderRadius = currentScroll / scrollHeight * 100 / 2 + '%'

		getDir = do ->
			if currentScroll > lastScroll
				hue++

				if currentScroll == scrollHeight
					getRandomColor()

			else if currentScroll < lastScroll
				hue--

				if currentScroll == 0
					getRandomColor()

			lastScroll = currentScroll

		el.style.backgroundColor = 'hsl(' + hue + ', 50%, 50%)'

	return