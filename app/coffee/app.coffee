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

	updateRandomColors = ->
		hue = Math.round(Math.random() * (999 - 111) + 111)

	setColor = (lightness = '50%') ->
		return 'hsl(' + hue + ', 50%, ' + lightness + ')'

	#set random color with refresh
	updateRandomColors()
	el.style.backgroundColor = setColor()

	window.onscroll = ->
		#we dont need 2 refresh if these var is inside the event
		documentHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		)
		currentScroll = window.pageYOffset
		scrollHeight = documentHeight - document.documentElement.clientHeight

		getDir = do ->
			if currentScroll > lastScroll
				hue++

			else if currentScroll < lastScroll
				hue--

			lastScroll = currentScroll

			if currentScroll == scrollHeight or currentScroll == 0
				updateRandomColors()

			middleScroll = scrollHeight / 2

			if currentScroll < middleScroll
				#to triangle
				triangleSize = currentScroll / (middleScroll * 0.01) / 10 + 'vh '
				elLightness = currentScroll / (scrollHeight * 0.01) + 50 + '%'
				triangleLightness = 100 - (currentScroll / (scrollHeight * 0.01)) + '%'
				radius = '0%'
				rotate = 45 - (currentScroll / (middleScroll * 0.01) / 2.2) + 'deg'
			else
				#to circle
				triangleSize = '10vh '
				elLightness = 100 - (currentScroll / (scrollHeight * 0.01) - 50) + '%'
				triangleLightness = '50%'
				radius = currentScroll / (scrollHeight * 0.01) - 50 + '%'
				rotate = '0deg'
				
			el.style.cssText  = '
				top: ' + currentScroll + 'px;
				border: ' + triangleSize + 'solid transparent;
				border-top: none;
				border-bottom-color: ' + setColor(triangleLightness) + ';
				border-radius: ' + radius + ';
				background-color: ' + setColor(elLightness) + ';
				transform: rotate(' + rotate + ');
				-webkit-transform: rotate(' + rotate + ');
				-ms-transform: rotate(' + rotate + ');
			'

	return