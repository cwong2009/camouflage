/* eslint-disable */
'use strict'
const env = require('./env')
import { create } from '../src/index'

function createNano(config) {
	const nano = create(config)
	return nano
}

describe('create()', function () {
	it('should exists', function () {
		expect(typeof create).toBe('function')
	})

	it('should create the renderer object', function () {
		const nano = createNano()

		expect(typeof nano).toBe('object')
	})

	it('should have a default prefix of ""', function () {
		expect(create().pfx).toBe('')
	})

	it('should have no default hyperscript function', function () {
		expect(create().h).toBe(undefined)
	})

	it('should have default hasher and hashChars', function () {
		expect(typeof create().hasher).toBe('function')
		expect(typeof create().hashChars).toBe('string')
	})

	it('should be configurable by passing an object as argument to it', function () {
		const h = function () {}
		const nano = createNano({
			pfx: 'hello-',
			h: h
		})

		expect(nano.pfx).toBe('hello-')
		expect(nano.h).toBe(h)
	})
})
