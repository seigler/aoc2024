import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split(' ').map(Number)

function cacheKey(...args) { // good enough
  return args.map(String).join('\n');
}
function memoize<T extends unknown[],U>(fn: (...args: T) => U): (...args: T) => U {
  const cache = {}; // Saves the values
  return (...args) => {
    const key = cacheKey(...args);
    if (!cache[key]) { // Not in the cache? Call fn.
      cache[key] = fn(...args); // Now it's in the cache.
    }
    return cache[key];
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const blink = (n: number, turn: number): number[] => {
    if (turn === 0) return [n]
    if (n === 0) return blink(1, turn - 1)
    const digits = Math.floor(Math.log10(n)) + 1
    if (digits % 2 === 0) {
      const exp = 10**(digits/2)
      return [
        ...blink(Math.floor(n / exp), turn - 1),
        ...blink(n % exp, turn - 1)
      ]
    }
    return blink(n * 2024, turn - 1)
  }
  return input.flatMap(s => blink(s, 25)).length
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const count = memoize((n: number, turn: number): number => {
    if (turn === 0) return 1
    if (n === 0) return count(1, turn - 1)
    const digits = Math.floor(Math.log10(n)) + 1
    if (digits % 2 === 0) {
      const exp = 10**(digits/2)
      return count(Math.floor(n / exp), turn - 1) + count(n % exp, turn - 1)
    }
    return count(n * 2024, turn - 1)
  })
  return input.reduce((total, s) => total + count(s, 75), 0)
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
