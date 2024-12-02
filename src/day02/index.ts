import run from "aocrunner"

const parseInput = (rawInput: string) => { return rawInput.split('\n').map(line => line.split(' ').map(Number)) }

const acceptableIncreases = [1, 2, 3]
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const differences = input.map(report => {
    const d = []
    report.forEach((level, i) => {
      if (i === 0) return
      d.push(level - report[i - 1])
    })
    return d
  })
  let safeCount = 0
  differences.forEach(report => {
    const sign = Math.sign(report[0])
    for (const difference of report) {
      if (!acceptableIncreases.includes(sign * difference)) {
        return // report fails
      }
    }
    safeCount++ // made it
  })
  return safeCount
}

const isSafe = (report: number[], errorsAllowed: 1 | 0): boolean => {
  const d = [] // differences
  report.forEach((level, i) => {
    if (i === 0) { return }
    d.push(level - report[i - 1])
  })
  const sign = Math.sign(d[0])
  for (const difference of d) {
    if (acceptableIncreases.includes(sign * difference)) continue
    if (errorsAllowed === 0) {
      return false
    }
    for (let removalIndex = 0; removalIndex < report.length; removalIndex++) {
      const fixed = report.toSpliced(removalIndex, 1)
      if (isSafe(fixed, 0)) { return true }
    }
    return false
  }
  return true
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((acc, report) => {
    const safe = isSafe(report, 1)
    return acc + (safe ? 1 : 0)
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
