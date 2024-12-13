import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""))

const orthogonals = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
]

const diagonals = [
  [-1, 1], // up right
  [1, 1], // down right
  [1, -1], // down left
  [-1, -1], // up left
]

const getNeighbors = (r: number, c: number) => {
  return orthogonals.map(([dr, dc]) => [r + dr, c + dc])
}

const getKey = (items: unknown[]) => {
  return items.join(",")
}

const unpackKey = <T>(key: Key, mapper: (input: string) => T) => {
  return key.split(",").map(mapper)
}

type Key = ReturnType<typeof getKey>

type Region = {
  symbol: string
  area: number
  perimeter: number
  plots: Key[]
}

const getRegions = (map: string[][]) => {
  let regions = new Set<Region>()

  map.forEach((row, r) => {
    row.forEach((symbol, c) => {
      const key = getKey([r, c])
      const neighbors = getNeighbors(r, c).map(getKey)
      let touches = 0
      let matchingRegions: Region[] = []
      regions.forEach((region) => {
        if (region.symbol !== symbol) return
        const newTouches = region.plots.filter((c) =>
          neighbors.includes(c),
        ).length
        if (newTouches > 0) {
          touches += newTouches
          matchingRegions.push(region)
          regions.delete(region)
        }
      })
      const newRegion = matchingRegions.reduce<Region>(
        (acc, cur) => {
          acc.area += cur.area
          acc.perimeter += cur.perimeter
          acc.plots.push(...cur.plots)
          return acc
        },
        {
          symbol,
          area: 1,
          perimeter: 4 - 2 * touches,
          plots: [key],
        },
      )
      regions.add(newRegion)
    })
  })
  return regions
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return Array.from(getRegions(input)).reduce(
    (total, region) => total + region.perimeter * region.area,
    0,
  )
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const regions = getRegions(input)

  return Array.from(regions).reduce((total, { plots, area }) => {
    let corners = 0
    plots.forEach((plot) => {
      const [r, c] = unpackKey(plot, Number)
      const orthogonalProbes = getNeighbors(r, c)
        .map(getKey)
        .map((k) => plots.includes(k))
      const diagonalProbes = diagonals.map(([dr, dc]) =>
        plots.includes(getKey([r + dr, c + dc])),
      )
      orthogonalProbes.forEach((presentThisDirection, thisDirection) => {
        const nextDirection = (thisDirection + 1) % 4
        const presentNextDirection = orthogonalProbes[nextDirection]
        if (
          // example: plot is X, direction is right
          // ###
          // #XA
          // #B.
          presentThisDirection && // A
          presentNextDirection && // B
          !diagonalProbes[thisDirection] // .
        ) {
          corners += 1
        }
        if (
          // example: plot is X, direction is right
          // ##.
          // #X!
          // .!.
          !presentThisDirection && // !
          !presentNextDirection // !
        ) {
          corners += 1
        }
      })
    })
    return total + corners * area
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `AAAA
  BBCD
  BBCC
  EEEC`,
        expected: 140,
      },
      {
        input: `OOOOO
  OXOXO
  OOOOO
  OXOXO
  OOOOO`,
        expected: 772,
      },
      {
        input: `RRRRIICCFF
  RRRRIICCCF
  VVRRRCCFFF
  VVRCCCJFFF
  VVVVCJJCFE
  VVIVCCJJEE
  VVIIICJJEE
  MIIIIIJJEE
  MIIISIJEEE
  MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: part1,
  },
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
        expected: 368,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
