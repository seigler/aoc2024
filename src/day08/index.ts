import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(''))

const part1 = (rawInput: string) => {
  const rows = parseInput(rawInput)
  const towers = new Map<string, string[]>() // 'a' => ['4,5', '7,7'] etc
  const antinodes = new Set<string>()
  rows.forEach((row, r) => {
    row.forEach((char, c) => {
      if (char === '.') return
      const towerLocations = towers.get(char) ?? []
      towerLocations.forEach(locationKey => {
        const [r2,c2] = locationKey.split(',').map(Number)
        const newAntinodes = [[2*r2-r, 2*c2-c], [2*r-r2, 2*c-c2]]
        newAntinodes.forEach(([y, x]) => {
          if (y < 0 || y >= rows.length || x < 0 || x >= row.length) {
            return
          }
          antinodes.add(`${y},${x}`)
        })
      })
      towerLocations.push(`${r},${c}`)
      towers.set(char, towerLocations)
    })
  })
  return antinodes.size
}

const part2 = (rawInput: string) => {
  const rows = parseInput(rawInput)
  const towers = new Map<string, string[]>() // 'a' => ['4,5', '7,7'] etc
  const antinodes = new Set<string>()
  rows.forEach((row, r) => {
    row.forEach((char, c) => {
      if (char === '.') return
      const towerLocations = towers.get(char) ?? []
      towerLocations.forEach(locationKey => {
        const [r2,c2] = locationKey.split(',').map(Number)
        const slopeTop = c2-c
        const slopeBottom = r2-r
        for (let R = 0; R < rows.length; R++) {
          const dr = R - r
          const dc = dr * slopeTop / slopeBottom
          const C = c + dc
          if (C < 0 || C >= row.length || C % 1 !== 0) {
            continue
          }
          antinodes.add(`${R},${C}`)
        }
      })
      towerLocations.push(`${r},${c}`)
      towers.set(char, towerLocations)
    })
  })
  return antinodes.size
}

run({
  part1: {
    tests: [
      {
        input: `..........
..........
..........
....a.....
........a.
.....a....
..........
..........
..........
..........`,
        expected: 4
      },
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`,
        expected: 9
      },
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
