# hafas-departures-in-direction

Pass in a [`hafas-client`](https://github.com/public-transport/hafas-client#hafas-client)-compatible [HAFAS](https://de.wikipedia.org/wiki/HAFAS) API client and **get departures at a station in a certain direction.**

*Note:* **This library is obsolete** because [`hafas-client` now supports querying departures by direction](https://github.com/public-transport/hafas-client/blob/c80f355d47cf5d818df45a3dd7adf895a0178a23/docs/departures.md#departuresstation-opt). Use it directly or [`hafas-collect-departures-at`](https://github.com/derhuerst/hafas-collect-departures-at) to collect departures with any termination logic.

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)
[![npm version](https://img.shields.io/npm/v/hafas-departures-in-direction.svg)](https://www.npmjs.com/package/hafas-departures-in-direction)
[![build status](https://img.shields.io/travis/derhuerst/hafas-departures-in-direction.svg)](https://travis-ci.org/derhuerst/hafas-departures-in-direction)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hafas-departures-in-direction.svg)


## Installing

```shell
npm install hafas-departures-in-direction
```


## Usage

Pass in your [`hafas-client`](https://github.com/public-transport/hafas-client#hafas-client)-compatible [HAFAS](https://de.wikipedia.org/wiki/HAFAS) API client. In this case, we're going to use [`vbb-hafas`](https://github.com/derhuerst/vbb-hafas#vbb-hafas):

```js
const setup = require('hafas-departures-in-direction')
const hafas = require('vbb-hafas')

const depsInDirection = setup(hafas.departures, hafas.journeyLeg)
```

Specify the direction as the *next station* after the one you're querying departures for. `depsInDirection` will then query departures, advancing in time until it found enough results or sent enough requests.

```js
const friedrichstr = '900000100001' // where to get departures
const brandenburgerTor = '900000100025' // direction

depsInDirection(friedrichstr, brandenburgerTor)
.then(console.log)
.catch(console.error)
```

The results will look similar to [those of `hafas-client`](https://github.com/public-transport/hafas-client/blob/b6c530915f1bbdcb77d8867372674460dee453c8/docs/departures.md).

## API

```js
depsInDirection = setup(fetchDepartures, fetchJourneyLeg)
```

`fetchDepartures(stationId, opt)` should be API-compatible with [`hafas-client.departures`](https://github.com/public-transport/hafas-client/blob/b6c530915f1bbdcb77d8867372674460dee453c8/docs/departures.md). `fetchJourneyLeg(ref, lineName, opt)` should be API-compatible with [`hafas-client.journeyLeg`](https://github.com/public-transport/hafas-client/blob/b6c530915f1bbdcb77d8867372674460dee453c8/docs/journey-leg.md). Both should return valid [*FPTF* `1.1.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.1.1/spec/readme.md).

```js
depsInDirection(station, direction, [opt])
```

`opt` overrides the following defaults:

```js
{
	concurrency: 4, // max nr. of parallel requests
	results: 10, // nr. of results to collect
	maxQueries: 10, // max nr. of requests
	when: null // time in ms since epoch
}
```

Returns a `Promise` that resolves with an array of departures.
