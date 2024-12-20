import run from "aocrunner"

const ints = (line: string) => [...line.matchAll(/\d+/g)].map(Number)
const parseInput = (rawInput: string) => rawInput

const deltas: [Coord, Coord, Coord, Coord] = [
  [ 0,  1], // right
  [ 1,  0], // down
  [ 0, -1], // left
  [-1,  0], // up
]

type Coord = [number, number]

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
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

function memoize<T extends unknown[],U>(fn: (...args: T) => U): (...args: T) => U {
  const cache = {} // Saves the values
  return (...args) => {
    const key = args.join('\n')
    return cache[key] ?? (cache[key] = fn(...args))
  }
}
