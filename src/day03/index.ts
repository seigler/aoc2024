import run from "aocrunner"

type State = {
  mulEnabled: boolean
  total: number
}
type Instruction = "do"|"don't"|"mul"
const instructions: Record<Instruction, (state: State, args: string[]) => State> = {
  "do": (state, _args) => {
    return {
      ...state,
      mulEnabled: true
    }
  },
  "don't": (state, _args) => {
    return {
      ...state,
      mulEnabled: false
    }
  },
  "mul": (state, [a, b]) => {
    return {
      ...state,
      total: state.total + (state.mulEnabled ? parseInt(a) * parseInt(b) : 0)
    }
  }
}

const parseInput = (rawInput: string) => {
  const tokenRegexp = new RegExp(`(${Object.keys(instructions).join('|')})\\(((\\d+,?)*)\\)`, 'g')
  const matches = rawInput.matchAll(tokenRegexp)
  return Array.from(matches).map(match => {
    const [, instruction, parameters] = match
    return [instruction as Instruction, parameters === "" ? [] : parameters.split(',')] as const
  })
}

const part1 = (rawInput: string) => {
  const input = rawInput
  const matches = input.matchAll(/mul\((\d+),(\d+)\)/g)
  return Array.from(matches).reduce((acc, m) => {
    const [,a,b] = m
    return acc + parseInt(a) * parseInt(b)
  }, 0)
}

const part2 = (rawInput: string) => {
  const program = parseInput(rawInput)
  let state: State = {
    total: 0,
    mulEnabled: true
  }
  program.forEach(([instruction, parameters]) => {
    state = instructions[instruction](state, parameters)
  })
  return state.total
}

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
