'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var addon = function (renderer) {
	const hydrated = {}

	renderer.hydrate = function (sh) {
		const cssRules = sh.cssRules || sh.sheet.cssRules

		for (let i = 0; i < cssRules.length; i++)
			hydrated[cssRules[i].selectorText] = 1
	}

	if (renderer.client) {
		if (renderer.sh) renderer.hydrate(renderer.sh)

		const put = renderer.put

		renderer.put = function (selector, css) {
			if (selector in hydrated) {
				if (process.env.NODE_ENV !== 'production') {
					// eslint-disable-next-line
					console.info('Hydrated selector: ' + selector)
				}

				return
			}

			put(selector, css)
		}
	}
}

var hydration = {
	addon: addon
}

exports.addon = addon
exports.default = hydration
