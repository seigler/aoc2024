import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const [registers, program] = rawInput.split("\n\n")
  return {
    registers: registers.split("\n").map((r) => BigInt(r.split(": ")[1])),
    program: program.split(": ")[1].split(",").map(Number),
  }
}

const mod = (a: bigint, b: bigint) => ((a % b) + b) % b

const explainProgram = (program: number[]) => {
  let explanation = ""
  const ops: ((x: number) => void)[] = [
    (x) => `A = A >> ${combo(x)}`,
    (x) => `B = B XOR ${x}`,
    (x) => `B = ${combo(x)} % 8`,
    (x) => `GOTO ${x}`,
    () => `B = B XOR C`,
    (x) => `Output ${combo(x)} % 8`,
    (x) => `B = B >> ${combo(x)}`,
    (x) => `C = C >> ${combo(x)}`,
  ]
  const combo = (x: number) => "0123ABC"[x]
  for (let i = 0; i < program.length; i += 2) {
    const op = ops[program[i]](program[i + 1])
    explanation += `${i}: ${op}\n`
  }
  return explanation
}

const execute = (registers: bigint[], program: number[]) => {
  let [a, b, c] = registers
  let pointer = 0
  const output: number[] = []
  const getCombo = (n: number) => [0n, 1n, 2n, 3n, a, b, c][n]
  const ops: ((operand: number) => void)[] = [
    function adv(n) {
      a = a >> getCombo(n)
      pointer += 2
    },
    function bxl(n) {
      b = b ^ BigInt(n)
      pointer += 2
    },
    function bst(n) {
      b = mod(getCombo(n), 8n)
      pointer += 2
    },
    function jnz(n) {
      pointer = a === 0n ? pointer + 2 : n
    },
    function bxc(_) {
      b = b ^ c
      pointer += 2
    },
    function out(n) {
      output.push(Number(mod(getCombo(n), 8n)))
      pointer += 2
    },
    function bdv(n) {
      b = a >> getCombo(n)
      pointer += 2
    },
    function cdv(n) {
      c = a >> getCombo(n)
      pointer += 2
    },
  ]
  while (true) {
    if (pointer >= program.length) {
      return output
    }
    const opcode = program[pointer]
    const operand = program[pointer + 1]
    ops[opcode](operand)
  }
}

const part1 = (rawInput: string) => {
  const { registers, program } = parseInput(rawInput)
  return execute(registers, program).join()
}

const part2 = (rawInput: string) => {
  const {
    registers: [_a, b, c],
    program,
  } = parseInput(rawInput)
  console.log(explainProgram(program))

  let i = 0n
  let found = 0
  while (true) {
    const result = execute([i, b, c], program)
    console.log(`${i} ${result.join()}`)
    let matchCount = 0
    for (let j = 0; j < result.length; j++) {
      if (result[result.length - 1 - j] === program[program.length - 1 - j]) {
        matchCount++
      } else break
    }
    if (matchCount === program.length) {
      return Number(i)
    }
    if (matchCount > found) {
      i = i << (3n * BigInt(matchCount - found))
      found = matchCount
    } else {
      i++
    }
  }
}

run({
  part1: {
    tests: [
      {
        input: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
        expected: `4,6,3,5,6,3,5,2,1,0`,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`,
        expected: 117440,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
