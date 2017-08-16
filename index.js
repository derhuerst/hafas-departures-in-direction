'use strict'

const Queue = require('p-queue')
const departures = require('vbb-hafas/lib/departures')
const journeyPart = require('vbb-hafas/lib/journey-part')

const minute = 60 * 1000

const defaults = {
	concurrency: 4,
	results: 10,
	maxQueries: 10
}

const depsInDirection = (station, direction, opt = {}) => {
	return new Promise((yay, nay) => {
		opt = Object.assign({}, defaults, opt)

		const res = []
		let when = Date.now(), queries = 0, stop = false
		const queue = new Queue({concurrency: opt.concurrency})

		const checkDep = (dep) => () => {
			if (stop) return Promise.resolve()

			return journeyPart(dep.ref, dep.line.name, {when})
			.then((journey) => {
				// todo: use stationOf index?
				const i = journey.passed.findIndex(p => p.station.id === station)
				const next = journey.passed[i + 1]
				if (next && next.station.id === direction) res.push(dep)
			})
			.catch((err) => {
				// todo: retry
				if (!err.statusCode) nay(err) // ignore HTTP errors
			})
		}

		const loop = () => {
			departures(station, {when: new Date(when), duration: 5})
			.then((deps) => {
				for (let dep of deps) queue.add(checkDep(dep))
				return queue.onEmpty()
			})
			.then(() => {
				// todo: opt.timeout?
				if (res.length >= opt.results || queries >= opt.maxQueries) {
					stop = true
					yay(res)
				} else loop()
			})
			.catch(nay)

			when += 5 * minute
			queries++
		}
		loop()
	})
}

module.exports = depsInDirection
