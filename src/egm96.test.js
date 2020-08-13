
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
  expect(calc).toBeCloseTo(ref, 0)
}

test('intersection test', () => {
  for (let a = -89; a <= 90; a += 30) {
    for (let o = -179; o <= 180; o += 30) {
      testComparison(a, o, false)
    }
  }
})

test('non intersection test', () => {
  for (const [lat, lon] of samples) {
    testComparison(lat, lon, false)
  }
})

test('extremes', () => {
  expect(egm96.getGeoidMeanSeaLevel(-90, -180)).not.toBeNull()
  expect(egm96.getGeoidMeanSeaLevel(90, -180)).not.toBeNull()
  expect(egm96.getGeoidMeanSeaLevel(-90, 180)).not.toBeNull()
  expect(egm96.getGeoidMeanSeaLevel(90, 180)).not.toBeNull()
})

// 100 randomly generated coordinates
const samples = [
  [65.41925379316297, 31.842245542653615],
  [8.09361399667624, 47.253173042499895],
  [19.037712154981605, -19.001271414784014],
  [-53.06508350027629, 94.2376122945239],
  [-59.52686843091574, 135.85191397504911],
  [-5.753580061637919, 140.32946155422962],
  [-0.05276609486573136, 163.55893454824889],
  [40.08158392959399, -89.95729700580424],
  [-56.2566124010878, 72.24179628886353],
  [31.613635299538927, 169.74314272497372],
  [86.9091229011133, -86.22064920943687],
  [42.552538394181425, -14.302287494705894],
  [-44.45090809541562, -39.56724618998757],
  [-68.606803033331, -111.83364040995598],
  [42.72931852705153, 165.04200594313744],
  [-7.4600550084747255, 150.03497956327152],
  [54.903323352331, -160.6524684166356],
  [-2.6706057877334786, -74.05556649204202],
  [-32.786263002997856, -128.9843740911754],
  [58.148674713410344, 52.73022621663347],
  [40.365138685076744, -114.77064240452614],
  [-19.675120008228348, -28.482049989904624],
  [61.563087942967115, 136.25730640287156],
  [12.724413434208088, -45.60050679575954],
  [-80.25135573867485, -66.64345217010614],
  [-52.5465901932033, 169.32238838556975],
  [-40.37015220591104, -167.07485455621185],
  [12.686051830410264, -169.52064755195215],
  [-60.10639965704666, 31.668250991467573],
  [-21.66883999098131, 56.14740286926934],
  [1.159149432307288, 164.34769345947666],
  [2.6083080210449623, -100.51205725697592],
  [-14.877326462663248, 162.2522067004624],
  [-51.1590882865108, -158.81935525829127],
  [21.822659681359127, 41.53055418305766],
  [-5.752062501035539, 101.29674056270221],
  [19.66063802749474, 104.98456187804999],
  [74.28089738465687, -39.2518210456561],
  [66.77932960588527, 58.615239510182704],
  [69.35453479717202, 70.50033931951054],
  [-74.66662064382575, -69.37008284947578],
  [-33.9090425359809, -103.70912580548159],
  [43.19780808141772, -131.7518379465897],
  [34.07890716625158, -174.7585100382134],
  [-0.7974142807863416, -32.6596462226081],
  [78.41940111016723, -35.79749613753975],
  [-19.94836270711869, -168.7472941263654],
  [53.78871179022494, -57.23453915130614],
  [-72.21484044356005, -41.49488180364608],
  [-4.38942407631464, -58.35335390250549],
  [16.13878137709024, -137.73989285359718],
  [-36.708503096922314, 6.273400173513068],
  [65.43416418420802, 1.6845064358581396],
  [-55.46354571142033, 38.878605511373536],
  [12.691681370543435, 42.189671191323924],
  [-66.23189065799208, 30.224983698129506],
  [11.530197369961854, 179.96304903014425],
  [-57.54393503578611, -117.73266832724697],
  [-24.030503354453472, 136.95284412523233],
  [39.681394508341356, 119.72868408414098],
  [-25.56082503663231, -71.18815475867774],
  [-0.4460746947190586, -103.20650976404548],
  [2.822816930234481, 114.07998799865197],
  [42.914119146115524, -63.561819983028286],
  [19.240011499145623, -86.42944535679084],
  [9.39357512446324, 144.18607928411734],
  [30.65863075429688, 19.640110881268924],
  [77.79626621958619, 97.34653401662428],
  [12.497350100610277, -164.63337274951482],
  [10.383927276600375, -64.6073840675185],
  [-85.47904327719803, 6.579128936088466],
  [-28.47504258740362, -4.911803359825825],
  [14.22480040277756, 176.4574278110473],
  [-14.544889753903476, -126.54041197796396],
  [50.30537815643632, 7.604358422359638],
  [19.814891416876705, -68.36936460082595],
  [49.92215565220744, -94.78773421099699],
  [82.30414274404657, 5.235899009875197],
  [23.088194219551937, -74.84635965959059],
  [-36.71095206747451, 58.832201652936874],
  [-88.52749138823037, -0.020349216453723784],
  [-63.63454314455031, 132.34613734520394],
  [10.64846536614671, -95.72467443493798],
  [-10.787849655198642, -51.26846985350119],
  [33.7219015841322, -78.88880103065415],
  [-84.96045253207585, -2.759531942052263],
  [15.812135732872207, 128.70604432263366],
  [22.554672632282106, -78.62176031626974],
  [-17.79977079452746, -51.217727092084345],
  [38.255886788893406, -13.571436538950138],
  [-56.2701286555117, -12.97969500440567],
  [35.21293942303846, 131.2316508126383],
  [-50.97567529479438, -48.22613025893622],
  [-27.25394297997039, 82.71051736815286],
  [-42.036788699071536, -62.36772493920844],
  [61.8256205734904, 147.11493409249175],
  [-53.060102048469076, 152.78112111368102],
  [22.52382808656894, 131.597095038804],
  [-13.663793565096213, 40.99931026259236],
  [-45.205139535204374, -122.35441271552189]
]
