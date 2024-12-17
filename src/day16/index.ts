import run from "aocrunner"
import Heap from 'heap'

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(''))

type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & { length: TLength }

const deltas: [Coord, Coord, Coord, Coord] = [
  [ 0,  1], // right
  [ 1,  0], // down
  [ 0, -1], // left
  [-1,  0], // up
]

type Coord = [number, number]

const bold = (text: string) => {
  return `\x1b[44;37m${text}\x1b[0m`
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
  const get = (r: number, c: number) => (input[r] ?? [])[c]
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
  while (pq.size() > 0) {
    const prev = pq.pop()
    const { r, c, dir, cost } = prev
    const here = get(r, c)
    if (here === 'E') {
      // draw it
      let cur = prev.prev
      const visited = new Map<string, number>()
      while (cur.prev !== null) {
        visited.set(`${cur.r},${cur.c}`, cur.dir)
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
      return cost
    }
    for (let i = 0; i < (here === "S" ? 4 : 3); i += 1) {
      const newDir = (dir + 3 + i) % 4 // left, ahead, right, u-turn
      const [dr, dc] = deltas[newDir]
      const addedCost = [1001, 1, 1001, 2001][i]
      if (get(r + dr, c + dc) !== "#") pq.push({
        r: r + dr,
        c: c + dc,
        dir: newDir,
        cost: cost + addedCost,
        prev,
      })
    }
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
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
        expected: 7036,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
