'use strict'

const Queue = require('p-queue')
const omit = require('lodash.omit')

const minute = 60 * 1000

const defaults = {
	concurrency: 4,
	results: 10,
	maxQueries: 10
}

const setup = (departures, journeyLeg) => {
	const depsInDirection = (station, direction, opt = {}) => {
		return new Promise((yay, nay) => {
			opt = Object.assign({}, defaults, opt)

			const res = []
			const queue = new Queue({concurrency: opt.concurrency})

			let when = Date.now()
			if (opt.when) {
				if (Number.isNaN(+opt.when)) throw new Error('invalid when parameter')
				when = +opt.when
			}
			let queries = 0, stop = false

			const checkDep = (dep) => () => {
				if (stop) return Promise.resolve()

				return journeyLeg(dep.journeyId, dep.line.name, {when})
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
				const _opt = omit(opt, ['concurrency', 'results', 'maxQueries'])
				_opt.when = when
				_opt.duration = 5

				departures(station, _opt)
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

	return depsInDirection
}

module.exports = setup
