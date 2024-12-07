import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(/[: ]+/).map(Number))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input.reduce((total, [target, ...values]) => {
    const operators = [(a,b) => a * b, (a,b) => a + b]
    const evaluate = (numbers: number[]) => {
      if (numbers[0] > target) {
        return false
      }
      if (numbers.length === 1) {
        return numbers[0] === target
      }
      for (const op of operators) {
        if (evaluate([op(numbers[0], numbers[1]), ...numbers.slice(2)])) { return true }
      }
    }
    return total + (evaluate(values) ? target : 0)
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input.reduce((total, [target, ...values]) => {
    const operators = [(a,b) => a * b, (a,b) => a + b, (a,b) => Number(`${a}${b}`)]
    const evaluate = (numbers: number[]) => {
      if (numbers[0] > target) {
        return false
      }
      if (numbers.length === 1) {
        return numbers[0] === target
      }
      for (const op of operators) {
        if (evaluate([op(numbers[0], numbers[1]), ...numbers.slice(2)])) { return true }
      }
    }
    return total + (evaluate(values) ? target : 0)
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749,
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
