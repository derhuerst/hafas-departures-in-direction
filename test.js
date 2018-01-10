'use strict'

const {DateTime} = require('luxon')
const hafas = require('vbb-hafas')
const test = require('tape')
const isRoughlyEqual = require('is-roughly-equal')

const setup = require('.')

const friedrichstr = '900000100001'
const brandenburgerTor = '900000100025'

const hour = 60 * 60 * 1000

// next Monday 10 am
const when = DateTime.fromMillis(Date.now(), {
	zone: 'Europe/Berlin',
	locale: 'de-DE'
}).startOf('week').plus({weeks: 1, hours: 10}).toJSDate()

const assertValidWhen = (t, w, tolerance = hour) => {
	t.equal(typeof w, 'string')
	const ts = +new Date(w)
	t.ok(!Number.isNaN(ts))
	t.ok(isRoughlyEqual(tolerance, +when, ts))
}

const depsInDirection = setup(hafas.departures, hafas.journeyLeg)

test('depsInDirection', (t) => {
	depsInDirection(friedrichstr, brandenburgerTor, {when})
	.then((deps) => {
		t.ok(Array.isArray(deps))
		t.ok(deps.length > 0)
		t.deepEqual(deps, deps.sort((a, b) => t.when > b.when))

		for (let dep of deps) {
			t.equal(typeof dep.journeyId, 'string')
			t.ok(dep.journeyId)
			t.equal(dep.station.id, friedrichstr)

			assertValidWhen(t, dep.when)
		}
	})
	.catch(t.ifError)
	.then(() => t.end())
})
