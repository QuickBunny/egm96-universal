
import * as egm96 from './egm96'
import * as cp from 'child_process'
import path from 'path'
import fs from 'fs'

const clean = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
}

const getReferenceHeight = (lat, lon) => {
  lon = lon < 0 ? lon + 360 : lon
  try {
    clean(path.join(__dirname, '../INPUT.DAT'))
    clean(path.join(__dirname, '../OUTINTPT.DAT'))
    fs.writeFileSync(path.join(__dirname, '../INPUT.DAT'), `${lat} ${lon}`)
    cp.execFileSync(path.join(__dirname, '../reference/intptdac'), {
      cwd: path.join(__dirname, '../'),
      stdio: 'ignore'
    })
    const content = fs.readFileSync(path.join(__dirname, '../OUTINTPT.DAT'), {
      encoding: 'utf-8'
    })
    const r = /\s*([+-]?(?:[0-9]*[.])?[0-9]+)\s+([+-]?(?:[0-9]*[.])?[0-9]+)\s+([+-]?(?:[0-9]*[.])?[0-9]+)\s*/
    const m = r.exec(content)
    if (!m[3]) {
      throw new Error('Invalid content')
    }
    return parseFloat(m[3])
  } finally {
    clean(path.join(__dirname, '../INPUT.DAT'))
    clean(path.join(__dirname, '../OUTINTPT.DAT'))
  }
}

const testComparison = (lat, lon, display) => {
  const ref = getReferenceHeight(lat, lon)
  const calc = egm96.getGeoidMeanSeaLevel(lat, lon)
  if (display) {
    console.log(`${lat} ${lon}: ref=${ref}, calc=${calc}`)
  }
  expect(calc).toBeCloseTo(ref, 1)
}

test('intersection test', () => {
  for (let a = -89; a <= 90; a += 30) {
    for (let o = -180; o <= 180; o += 30) {
      testComparison(a, o, false)
    }
  }
})

test('non intersection test', async () => {
  testComparison(50.7129201, 5.6688935, true)
  testComparison(50.7113365, 5.6797431, true)
})
