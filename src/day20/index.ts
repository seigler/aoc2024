import run from "aocrunner"

const ints = (line: string) => [...line.matchAll(/\d+/g)].map(Number)
const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""))

const deltas: [Coord, Coord, Coord, Coord] = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
]

type Coord = [number, number]

function manhattan([ar, ac]: Coord, [br, bc]: Coord) {
  return Math.abs(ar - br) + Math.abs(ac - bc)
}

const part1 = (rawInput: string, mustSave = 100, maxCheat = 2) => {
  const input = parseInput(rawInput)
  let S: Coord
  let E: Coord
  input.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === "S") S = [r, c]
      if (cell === "E") E = [r, c]
    })
  })
  let [r, c] = S
  const path: Coord[] = [S]
  while (true) {
    const neighbors = deltas.map<Coord>(([dr, dc]) => [r + dr, c + dc])
    const next = neighbors.find(([nr, nc]) => {
      if (input[nr][nc] === "#") return false
      return path.find(([pr, pc]) => pr === nr && pc === nc) === undefined
    })
    if (next === undefined) break
    ;[r, c] = next
    path.push(next)
  }
  let total = 0
  for (let i = 0; i < path.length; i++) {
    for (let j = i + mustSave; j < path.length; j++) {
      const distance = manhattan(path[i], path[j])
      if (distance <= maxCheat && j - i - distance >= mustSave) {
        total++
      }
    }
  }
  return total
}

const part2 = (rawInput: string) => {
  return part1(rawInput, 100, 20)
}

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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

function bold(text: string) {
  return `\x1b[44;37;1m${text}\x1b[0m`
}

function memoize<T extends unknown[], U>(
  fn: (...args: T) => U,
): (...args: T) => U {
  const cache = {} // Saves the values
  return (...args) => {
    const key = args.join("\n")
    return cache[key] ?? (cache[key] = fn(...args))
  }
}
