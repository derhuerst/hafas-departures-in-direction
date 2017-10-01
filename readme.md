# vbb-departures-in-direction

**Get departures at a VBB station in a certain direction.** Uses [vbb-hafas](https://github.com/derhuerst/vbb-hafas).

[![npm version](https://img.shields.io/npm/v/vbb-departures-in-direction.svg)](https://www.npmjs.com/package/vbb-departures-in-direction)
[![build status](https://img.shields.io/travis/derhuerst/vbb-departures-in-direction.svg)](https://travis-ci.org/derhuerst/vbb-departures-in-direction)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-departures-in-direction.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install vbb-departures-in-direction
```


## Usage

Specify the direction as the *next station* after the one you're querying departures for. `depsInDirection` will then query departures, advancing the time until it found enough results or sent enough requests.

```js
const depsInDirection = require('vbb-departures-in-direction')

const friedrichstr = '900000100001' // where to get departures
const brandenburgerTor = '900000100025' // direction

depsInDirection(friedrichstr, brandenburgerTor)
.then(console.log)
.catch(console.error)
```

## API

```js
depsInDirection(station, direction, [opt])
```

`opt` overrides the following defaults:

```js
{
	concurrency: 4, // max nr. of parallel requests
	results: 10, // nr. of results to collect
	maxQueries: 10, // max nr. of requests
	when: 0 // time in ms to offset departure time
}
```


## Contributing

If you have a question or have difficulties using `vbb-departures-in-direction`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-departures-in-direction/issues).
