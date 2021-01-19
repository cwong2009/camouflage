/* eslint-disable */
'use strict'

const env = require('./env')
import { create } from '../src/index'
import addonRule from '../src/addon/rule'
import addonVirtual from '../src/addon/virtual'
import addonKeyframes from '../src/addon/keyframes'

function createNano(config) {
	const nano = create(config)

	addonRule(nano)
	addonVirtual(nano)

	return nano
}

describe('virtual', function () {
	it('installs interface', function () {
		const nano = createNano()

		expect(typeof nano.atomic).toBe('function')
		expect(typeof nano.virtual).toBe('function')
	})

	describe('atomic()', function () {
		it('injects raw styles', function () {
			const nano = createNano({
				pfx: '_'
			})

			const className = nano.atomic('&', 'color:red;', '')

			expect(className).toBe('_a')

			if (env.isServer) {
				expect(nano.raw).toBe('._a{color:red;}')
			}
		})

		it('increments ID', function () {
			const nano = createNano({
				pfx: '_'
			})

			expect(nano.atomic('&', 'color:red;')).toBe('_a')
			expect(nano.atomic('&', 'color:blue;')).toBe('_b')
			expect(nano.atomic('&', 'color:green;')).toBe('_c')

			if (env.isServer) {
				expect(nano.raw).toBe(
					'._a{color:red;}._b{color:blue;}._c{color:green;}'
				)
			}
		})

		it('caches basic declarations', function () {
			const nano = createNano({
				pfx: '_'
			})

			expect(nano.atomic('&', 'color:red;')).toBe('_a')
			expect(nano.atomic('&', 'color:red;')).toBe('_a')
		})

		it('at-rules', function () {
			const nano = createNano({
				pfx: '_'
			})

			nano.atomic('&', 'color:red;', '@media screen')

			if (env.isServer) {
				expect(nano.raw).toBe('@media screen{._a{color:red;}}')
			}
		})

		it('caches at-rules', function () {
			const nano = createNano({
				pfx: '_'
			})

			const className = nano.atomic('&', 'color:red;', '@media screen')

			const cachedClassName = nano.atomic('&', 'color:red;', '@media screen')

			expect(className).toBe(cachedClassName)
		})
		//
		// it('interpolates selector', function() {
		// 	const nano = createNano({
		// 		pfx: '_'
		// 	})
		//
		// 	expect(
		// 		nano.atomic('.global &:hover', 'color:red;', '@media screen')
		// 	).toBe('_a')
		// 	expect(
		// 		nano.atomic('.global &:hover', 'color:red;', '@media screen')
		// 	).toBe('_a')
		//
		// 	if (env.isServer) {
		// 		expect(nano.raw).toBe('@media screen{.global ._a:hover{color:red;}}')
		// 	}
		// })
		//
		it('prefixes class names', function () {
			const nano = createNano({
				pfx: 'foo-'
			})

			expect(nano.atomic('&', 'color:red;')).toBe('foo-a')
		})
	})

	describe('virtual()', function () {
		it('injects CSS', function () {
			const nano = createNano({
				pfx: '_'
			})
			const className = nano.virtual('&', {
				color: 'red'
			})

			expect(className).toBe(' _a')
			if (env.isServer) {
				expect(nano.raw).toBe('._a{color:red}')
			}
		})

		// it('makes styles atomic', function() {
		// 	const nano = createNano()
		// 	const className = nano.virtual('&', {
		// 		color: 'red',
		// 		background: 'black',
		// 		textAlign: 'center'
		// 	})
		//
		// 	expect(className).toBe(' _a _b _c')
		//
		// 	if (env.isServer) {
		// 		expect(nano.raw.includes('color:red')).toBe(true)
		// 		expect(nano.raw.includes('background:black')).toBe(true)
		// 		expect(nano.raw.includes('text-align:center')).toBe(true)
		// 	}
		// })
		//
		// it('allows nesting', function() {
		// 	const nano = createNano()
		// 	const className = nano.virtual('&', {
		// 		color: 'red',
		// 		':hover': {
		// 			color: 'blue'
		// 		}
		// 	})
		//
		// 	expect(className).toBe(' _a _b')
		//
		// 	if (env.isServer) {
		// 		expect(nano.raw.includes('._a')).toBe(true)
		// 		expect(nano.raw.includes('._b')).toBe(true)
		// 		expect(nano.raw.includes(':hover')).toBe(true)
		// 		expect(nano.raw.includes('color:red')).toBe(true)
		// 		expect(nano.raw.includes('color:blue')).toBe(true)
		// 	}
		// })
		//
		// it('multiple styles', function() {
		// 	const nano = createNano()
		//
		// 	nano.atomic = jest.fn()
		//
		// 	const className = nano.virtual('&', {
		// 		color: 'tomato',
		// 		border: '1px solid red',
		// 		margin: '10px auto',
		// 		padding: '0',
		// 		':focus': {
		// 			color: 'blue'
		// 		},
		// 		'@media screen': {
		// 			textAlign: 'right',
		// 			cursor: 'pointer'
		// 		}
		// 	})
		//
		// 	expect(nano.atomic).toHaveBeenCalledWith('&', 'color:tomato', undefined)
		// 	expect(nano.atomic).toHaveBeenCalledWith(
		// 		'&',
		// 		'border:1px solid red',
		// 		undefined
		// 	)
		// 	expect(nano.atomic).toHaveBeenCalledWith(
		// 		'&',
		// 		'margin:10px auto',
		// 		undefined
		// 	)
		// 	expect(nano.atomic).toHaveBeenCalledWith('&', 'padding:0', undefined)
		// 	expect(nano.atomic).toHaveBeenCalledWith(
		// 		'&:focus',
		// 		'color:blue',
		// 		undefined
		// 	)
		// 	expect(nano.atomic).not.toHaveBeenCalledWith(
		// 		'&:focus',
		// 		'color:tomato',
		// 		undefined
		// 	)
		// 	expect(nano.atomic).toHaveBeenCalledWith(
		// 		'&',
		// 		'text-align:right',
		// 		'@media screen'
		// 	)
		// 	expect(nano.atomic).toHaveBeenCalledWith(
		// 		'&',
		// 		'cursor:pointer',
		// 		'@media screen'
		// 	)
		// 	expect(nano.atomic).not.toHaveBeenCalledWith(
		// 		'&',
		// 		'color:tomato',
		// 		'@media screen'
		// 	)
		// })
		//
		// it('extrapolates array values', function() {
		// 	const nano = createNano()
		//
		// 	nano.atomic = jest.fn()
		//
		// 	const className = nano.virtual('&', {
		// 		color: 'blue;color:red;'
		// 	})
		//
		// 	expect(nano.atomic).toHaveBeenCalledTimes(2)
		// 	expect(nano.atomic).toHaveBeenCalledWith('&', 'color:blue', undefined)
		// 	expect(nano.atomic).toHaveBeenCalledWith('&', 'color:red', undefined)
		// })
		//
		// it('removes semicolons', function() {
		// 	const nano = createNano()
		//
		// 	nano.atomic = jest.fn()
		//
		// 	const className = nano.virtual('&', {
		// 		color: 'blue;;;;;'
		// 	})
		//
		// 	expect(nano.atomic).toHaveBeenCalledTimes(1)
		// 	expect(nano.atomic).toHaveBeenCalledWith('&', 'color:blue', undefined)
		// })
		//
		// it("doesn't break keyframes", function() {
		// 	const nano = createNano()
		// 	addonKeyframes(nano)
		//
		// 	nano.virtual('&', {
		// 		animation: 'sk-foldCubeAngle 2.4s infinite linear both',
		// 		'@keyframes sk-foldCubeAngle': {
		// 			'0%, 10%': {
		// 				transform: 'perspective(140px) rotateX(-180deg)',
		// 				opacity: 0
		// 			},
		// 			'25%, 75%': {
		// 				transform: 'perspective(140px) rotateX(0deg)',
		// 				opacity: 1
		// 			},
		// 			'90%, 100%': {
		// 				transform: 'perspective(140px) rotateY(180deg)',
		// 				opacity: 0
		// 			}
		// 		}
		// 	})
		//
		// 	if (env.isServer) {
		// 		expect(nano.raw).toEqual(
		// 			'._a{animation:sk-foldCubeAngle 2.4s infinite linear both}@-webkit-keyframes sk-foldCubeAngle{0%, 10%{transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{transform:perspective(140px) rotateY(180deg);opacity:0;}}@-moz-keyframes sk-foldCubeAngle{0%, 10%{transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{transform:perspective(140px) rotateY(180deg);opacity:0;}}@-o-keyframes sk-foldCubeAngle{0%, 10%{transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{transform:perspective(140px) rotateY(180deg);opacity:0;}}@keyframes sk-foldCubeAngle{0%, 10%{transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{transform:perspective(140px) rotateY(180deg);opacity:0;}}'
		// 		)
		// 	}
		// })
	})
})
