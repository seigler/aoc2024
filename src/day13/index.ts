import run from "aocrunner"

const solve = (rawInput: string, extra = 0) => {
  const machines = rawInput.split("\n\n").map((machine) => {
    return machine
      .split("\n")
      .map((l) => Array.from(l.matchAll(/\d+/g)).map(Number))
  })
  return machines.reduce((total, machine) => {
    const [[adx, ady], [bdx, bdy], [specx, specy]] = machine
    const prizex = extra + specx
    const prizey = extra + specy
    const bPresses = (prizex * ady - prizey * adx) / (bdx * ady - bdy * adx)
    const aPresses = (prizey - bPresses * bdy) / ady
    if (bPresses % 1 === 0 && aPresses % 1 === 0) {
      return total + 3 * aPresses + bPresses
    }
    return total
  }, 0)
}

const part1 = (rawInput: string) => {
  return solve(rawInput)
}

const part2 = (rawInput: string) => {
  return solve(rawInput, 10000000000000)
}

run({
  part1: {
    tests: [
      {
        input: `Button A: X+94, Y+34
  Button B: X+22, Y+67
  Prize: X=8400, Y=5400

  Button A: X+26, Y+66
  Button B: X+67, Y+21
  Prize: X=12748, Y=12176

  Button A: X+17, Y+86
  Button B: X+84, Y+37
  Prize: X=7870, Y=6450

  Button A: X+69, Y+23
  Button B: X+27, Y+71
  Prize: X=18641, Y=10279`,
        expected: 480,
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
