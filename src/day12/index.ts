import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(''))

const directions = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1] // left
]
const getNeighbors = (r: number, c: number) => {
  return directions.map(([dr, dc]) => [r + dr, c + dc])
}

const getKey = (items: unknown[]) => {
  return items.join(',')
}
type Key = ReturnType<typeof getKey>

type Region = {
  symbol: string
  area: number
  perimeter: number
  plots: Key[]
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let regions = new Set<Region>()

  input.forEach((row, r) => {
    row.forEach((symbol, c) => {
      const key = getKey([r, c])
      const neighbors = getNeighbors(r, c).map(getKey)
      let touches = 0
      let matchingRegions: Region[] = []
      regions.forEach(region => {
        if (region.symbol !== symbol) return
        const newTouches = region.plots.filter(c => neighbors.includes(c)).length
        if (newTouches > 0) {
          touches += newTouches
          matchingRegions.push(region)
          regions.delete(region)
        }
      })
      const newRegion = matchingRegions.reduce<Region>((acc, cur) => {
        acc.area += cur.area
        acc.perimeter += cur.perimeter
        acc.plots.push(...cur.plots)
        return acc
      }, {
        symbol,
        area: 1,
        perimeter: 4 - 2 * touches,
        plots: [key],
      })
      regions.add(newRegion)
    })
  })
  return Array.from(regions).reduce((total, region) => total + region.perimeter * region.area, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let regions = new Set<Region>()

  input.forEach((row, r) => {
    row.forEach((symbol, c) => {
      const key = getKey([r, c])
      const neighbors = getNeighbors(r, c).map(getKey)
      let touches = 0
      let matchingRegions: Region[] = []
      regions.forEach(region => {
        if (region.symbol !== symbol) return
        const newTouches = region.plots.filter(c => neighbors.includes(c)).length
        if (newTouches > 0) {
          touches += newTouches
          matchingRegions.push(region)
          regions.delete(region)
        }
      })
      const newRegion = matchingRegions.reduce<Region>((acc, cur) => {
        acc.area += cur.area
        acc.perimeter += cur.perimeter
        acc.plots.push(...cur.plots)
        return acc
      }, {
        symbol,
        area: 1,
        perimeter: 4 - 2 * touches,
        plots: [key],
      })
      regions.add(newRegion)
    })
  })

  return Array.from(regions).reduce((total, {
    symbol,
    plots,
    area,
  }) => {
    let corners = 0
    plots.forEach(plot => {
      const [r, c] = plot.split(',').map(Number)
      const boundaries = getNeighbors(r, c).map(getKey).map((k, i) => plots.includes(k) ? '' : i).join('')
      switch(boundaries) {
        case '0123':
          corners += 4
          break
        case '01':
        case '12':
        case '23':
        case '03':
          corners += 1
          break
        case '012':
        case '123':
        case '023':
        case '013':
          corners += 2
          break
      }
    })
    console.log(`Region of ${symbol} with ${corners} sides`)
    return total + corners * area
  }, 0)
}

run({
//   part1: {
//     tests: [
//       {
//         input: `AAAA
// BBCD
// BBCC
// EEEC`,
//         expected: 140,
//       },
//       {
//         input: `OOOOO
// OXOXO
// OOOOO
// OXOXO
// OOOOO`, expected: 772
//       },
//       {
//         input: `RRRRIICCFF
// RRRRIICCCF
// VVRRRCCFFF
// VVRCCCJFFF
// VVVVCJJCFE
// VVIVCCJJEE
// VVIIICJJEE
// MIIIIIJJEE
// MIIISIJEEE
// MMMISSJEEE`,
//         expected: 1930
//       }
//     ],
//     solution: part1,
//   },
  part2: {
    tests: [
      {
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 80,
      },
      {
        input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
        expected: 1206,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
