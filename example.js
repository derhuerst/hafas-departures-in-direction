'use strict'

const depsInDirection = require('.')

const friedrichstr = '900000100001'
const brandenburgerTor = '900000100025'
const leopoldplatz = '900000009102'
const nauenerPlatz = '900000009201'
const ostbahnhof = '900000120005'
const jannowitzbruecke = '900000100004'

depsInDirection(friedrichstr, brandenburgerTor)
// depsInDirection(leopoldplatz, nauenerPlatz)
// depsInDirection(ostbahnhof, jannowitzbruecke)
.then(console.log)
.catch(console.error)
