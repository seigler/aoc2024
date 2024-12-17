import run from "aocrunner"
import Heap from 'heap'

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(''))

const deltas: [Coord, Coord, Coord, Coord] = [
  [ 0,  1], // right
  [ 1,  0], // down
  [ 0, -1], // left
  [-1,  0], // up
]

type Coord = [number, number]

const bold = (text: string) => {
  return `\x1b[44;37;1m${text}\x1b[0m`
}

type Step = {
  r: number
  c: number
  dir: number
  cost: number
  prev: Step | null
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const startIndex = rawInput.indexOf('S')
  const c0 = startIndex % (input[0].length + 1)
  const r0 = (startIndex - c0) / (input[0].length + 1)
  const pq = new Heap<Step>((a, b) => a.cost - b.cost)
  pq.push({
    r: r0,
    c: c0,
    dir: 0,
    cost: 0,
    prev: null
  })
  const pqDict: Record<string, Step> = {}
  while (pq.size() > 0) {
    const prev = pq.pop()
    const { r, c, dir, cost } = prev
    const here = input[r][c]
    if (here === 'E') {
      { // draw it
        let cur = prev
        const visited = new Map<string, number>()
        while (cur.prev.prev !== null) {
          visited.set(`${cur.prev.r},${cur.prev.c}`, cur.dir)
          cur = cur.prev
        }
        console.log(
          input
            .map((row, r2) => {
              return row
                .map((cell, c2) => {
                  const key = `${r2},${c2}`
                  if (visited.has(key)) return bold(">v<^"[visited.get(key)])
                  if (cell === "#") return "\x1b[100m \x1b[0m"
                  if (cell === ".") return " "
                  return `\x1b[41m${cell}\x1b[0m`
                })
                .join("")
            })
            .join("\n"),
        )
      } // done drawing
      return cost
    }
    for (let i = 0; i < (here === "S" ? 4 : 3); i += 1) {
      const newDir = (dir + 3 + i) % 4 // left, ahead, right, u-turn
      const [dr, dc] = deltas[newDir]
      const addedCost = [1001, 1, 1001, 2001][i]
      if (input[r + dr][c + dc] === "#") continue
      const newKey = `${r+dr},${c+dc},${newDir}`
      if (pqDict[newKey] !== undefined && pqDict[newKey].cost < cost) continue
      const newStep: Step = {
        r: r + dr,
        c: c + dc,
        dir: newDir,
        cost: cost + addedCost,
        prev,
      }
      pqDict[newKey] = newStep
      pq.push(newStep)
    }
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const startIndex = rawInput.indexOf('S')
  const c0 = startIndex % (input[0].length + 1)
  const r0 = (startIndex - c0) / (input[0].length + 1)
  const pq = new Heap<Step>((a, b) => a.cost - b.cost)
  pq.push({
    r: r0,
    c: c0,
    dir: 0,
    cost: 0,
    prev: null
  })
  const pqDict: Record<string, Step> = {}
  let bestCost = Number.POSITIVE_INFINITY
  let visited = new Set<string>([`${r0},${c0}`])
  while (pq.size() > 0) {
    const prev = pq.pop()
    const { r, c, dir, cost } = prev
    const here = input[r][c]
    if (here === 'E') {
      if (cost > bestCost) break
      bestCost = cost
      let cursor = prev
      visited.add(`${r},${c}`)
      while (cursor.prev !== null) {
        visited.add(`${cursor.r},${cursor.c}`)
        cursor = cursor.prev
      }
      continue
    }
    for (let i = 0; i < (here === "S" ? 4 : 3); i += 1) {
      const newDir = (dir + 3 + i) % 4 // left, ahead, right, u-turn
      const [dr, dc] = deltas[newDir]
      const addedCost = [1001, 1, 1001, 2001][i]
      if (input[r + dr][c + dc] === "#") continue
      const newKey = `${r+dr},${c+dc},${newDir}`
      if (pqDict[newKey] !== undefined && pqDict[newKey].cost < cost) continue
      const newStep: Step = {
        r: r + dr,
        c: c + dc,
        dir: newDir,
        cost: cost + addedCost,
        prev,
      }
      pqDict[newKey] = newStep
      pq.push(newStep)
    }
  }
  { // draw it
    console.log(
      input
        .map((row, r2) => {
          return row
            .map((cell, c2) => {
              const key = `${r2},${c2}`
              if (visited.has(key)) return bold("O")
              if (cell === "#") return "\x1b[100m \x1b[0m"
              if (cell === ".") return " "
              return `\x1b[41m${cell}\x1b[0m`
            })
            .join("")
        })
        .join("\n"),
    )
  } // done drawing
  return visited.size
}

run({
//   part1: {
//     tests: [
//       {
//         input: `###############
// #.......#....E#
// #.#.###.#.###.#
// #.....#.#...#.#
// #.###.#####.#.#
// #.#.#.......#.#
// #.#.#####.###.#
// #...........#.#
// ###.#.#####.#.#
// #...#.....#.#.#
// #.#.#.###.#.#.#
// #.....#...#.#.#
// #.###.#.#.#.#.#
// #S..#.....#...#
// ###############`,
//         expected: 7036,
//       },
//       {
//         input: `#################
// #...#...#...#..E#
// #.#.#.#.#.#.#.#.#
// #.#.#.#...#...#.#
// #.#.#.#.###.#.#.#
// #...#.#.#.....#.#
// #.#.#.#.#.#####.#
// #.#...#.#.#.....#
// #.#.#####.#.###.#
// #.#.#.......#...#
// #.#.###.#####.###
// #.#.#...#.....#.#
// #.#.#.#####.###.#
// #.#.#.........#.#
// #.#.#.#########.#
// #S#.............#
// #################`,
//         expected: 11048
//       }
//     ],
//     solution: part1,
//   },
  part2: {
    tests: [
      {
        input: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
        expected: 45,
      },
      {
        input: `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
        expected: 64
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
