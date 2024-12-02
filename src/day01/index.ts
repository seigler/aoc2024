import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const rows = rawInput.split('\n').map(line => line.split(/\s+/).map(Number))
  let lists: number[][] = [[], []]
  rows.forEach(row => {
    row.forEach((value, index) => lists[index].push(value))
  })
  return lists
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  input.forEach(list => list.sort())
  let total = 0
  for (let i = 0; i < input[0].length; i++) {
    total += Math.abs(input[0][i] - input[1][i])
  }
  return total
}

const part2 = (rawInput: string) => {
  const [left, right] = parseInput(rawInput)
  right.sort()
  const counts = new Map<number, number>()
  right.forEach(entry => {
    counts.set(entry, (counts.get(entry) ?? 0) + 1)
  })
  const total = left.reduce((acc, cur) => { return acc + cur * (counts.get(cur) ?? 0)}, 0)
  return total
}

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
