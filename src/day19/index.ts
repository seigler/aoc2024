import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const [a,b] = rawInput.split('\n\n')
  const towels = a.split(', ')
  const patterns = b.split('\n')
  return {
    towels,
    patterns,
  }
}

const part1 = (rawInput: string) => {
  const {towels, patterns} = parseInput(rawInput)
  const reg = new RegExp(`^(${towels.join('|')})+$`)
  return patterns.reduce((total, pattern) => {
    return total + (reg.test(pattern) ? 1 : 0)
  }, 0)
}

const part2 = (rawInput: string) => {
  const {towels, patterns} = parseInput(rawInput)
  return patterns.reduce((total, pattern) => {
    const cache = new Map<number, number>()
    const ways = (index: number) => {
      if (cache.has(index)) {
        return cache.get(index)
      }
      if (index === pattern.length) {
        cache.set(index, 1)
        return 1
      }
      const ans = towels.reduce((total2, t) => {
        if (pattern.slice(index,index+t.length) === t) {
          return total2 + ways(index + t.length)
        }
        return total2
      }, 0)
      cache.set(index, ans)
      return ans
    }
    return total + ways(0)
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
