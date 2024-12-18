import run from "aocrunner"

const ints = (line: string) => [...line.matchAll(/\d+/g)].map(Number)
const parseInput = (rawInput: string) => rawInput.split('\n').map(ints)

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
  cost: number
  prev: Step | null
}

const MAP_SIZE = 70
const getKey = ([r, c]: [number, number]) => (MAP_SIZE + 1) * r + c
type Key = ReturnType<typeof getKey>

const navigate = (input: number[][], bytesDropped): number => {
  // start with the corrupted cells as seen. BFS will skip them
  const seen = new Set(input.slice(0,bytesDropped).map(getKey))
  const start: Step = { r: 0, c: 0, cost: 0, prev: null }
  const queue: Step[] = [start]
  while (true) {
    process.stdout.write(`\rSeen: ${seen.size} cells `)
    const cur = queue.shift()
    if (cur === undefined) return -1
    const { r, c, cost } = cur
    const key = getKey([r, c])
    if (seen.has(key)) continue
    seen.add(key)
    for (const [dr, dc] of deltas) {
      const nr = r + dr
      const nc = c + dc
      const key = getKey([nr, nc])
      if (seen.has(key)) continue
      const ncost = cost + 1
      if (nr === MAP_SIZE && nc === MAP_SIZE) return ncost // GOT IT
      if (nr < 0 || nc < 0 || nr > MAP_SIZE || nc > MAP_SIZE) continue
      const nextStep: Step = { r: nr, c: nc, cost: ncost, prev: cur }
      queue.push(nextStep)
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return navigate(input, 1024)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  for (let i = 1025; i < input.length; i++) {
    const result = navigate(input, i)
    process.stdout.write(`${i}`)
    if (result === -1) {
      return input[i - 1].join()
    }
  }
  return
}

run({
  part1: {
    tests: [
//       {
//         input: `5,4
// 4,2
// 4,5
// 3,0
// 2,1
// 6,3
// 2,4
// 1,5
// 0,6
// 3,3
// 2,6
// 5,1`,
//         expected: 22,
//       },
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
