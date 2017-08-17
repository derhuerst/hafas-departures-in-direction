'use strict'

const test = require('tape')
const floor = require('floordate')
const isRoughlyEqual = require('is-roughly-equal')

const depsInDirection = require('.')

const friedrichstr = '900000100001'
const brandenburgerTor = '900000100025'

const hour = 60 * 60 * 1000
const week = 7 * 24 * hour

// next Monday
const when = new Date(+floor(new Date(), 'week') + week + 10 * hour)

const assertValidWhen = (t, w, tolerance = hour) => {
	t.equal(typeof w, 'string')
	const ts = +new Date(w)
	t.ok(!Number.isNaN(ts))
	t.ok(isRoughlyEqual(tolerance, +when, ts))
}

test('depsInDirection', (t) => {
	depsInDirection(friedrichstr, brandenburgerTor, {when})
	.then((deps) => {
		t.ok(Array.isArray(deps))
		t.ok(deps.length > 0)
		// t.deepEqual(deps, deps.sort((a, b) => t.when > b.when))

		for (let dep of deps) {
			t.equal(typeof dep.ref, 'string')
			t.ok(dep.ref)
			t.equal(dep.station.id, friedrichstr)

			assertValidWhen(t, dep.when)
		}
	})
	.catch(t.ifError)
	.then(() => t.end())
})
