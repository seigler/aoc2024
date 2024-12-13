import run from "aocrunner"
const parseInput = (rawInput: string) =>
  rawInput.split("\n\n").map((machine) => {
    return machine
      .split("\n")
      .map((l) => Array.from(l.matchAll(/\d+/g)).map(Number))
  })

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let spent = 0
  for (const machine of input) {
    const [[adx, ady], [bdx, bdy], [prizex, prizey]] = machine
    let minCost = Number.POSITIVE_INFINITY
    const tried = new Set<string>()
    const simulate = (
      x: number,
      y: number,
      aPresses: number,
      bPresses: number,
    ) => {
      const key = [x, y, aPresses, bPresses].join()
      if (tried.has(key)) return
      tried.add(key)
      if (x > prizex || y > prizey) {
        return
      }
      const cost = aPresses * 3 + bPresses
      if (cost >= minCost) {
        return
      }
      if (x === prizex && y === prizey) {
        minCost = cost
        return
      }
      simulate(x + adx, y + ady, aPresses + 1, bPresses)
      simulate(x + bdx, y + bdy, aPresses, bPresses + 1)
    }
    simulate(0, 0, 0, 0)
    if (minCost < Number.POSITIVE_INFINITY) {
      spent += minCost
    }
  }
  return spent
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let spent = 0
  for (const machine of input) {
    const [[adx, ady], [bdx, bdy], [specx, specy]] = machine
    const prizex = 10000000000000 + specx
    const prizey = 10000000000000 + specy
    const bPresses = (prizex * ady - prizey * adx) / (bdx * ady - bdy * adx)
    const aPresses = (prizey - bPresses * bdy) / ady
    console.log({ aPresses, bPresses })
    if (bPresses % 1 === 0 && aPresses % 1 === 0) {
      spent += 3 * aPresses + bPresses
    }
  }
  return spent
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
