import run from "aocrunner"

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map(line => line.split(''))
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let total = 0
  input.forEach((line,r) => {
    line.forEach((cell, c) => {
      total += [
        [[r,c],[r,c+1],[r,c+2],[r,c+3]], // right
        [[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3]], // downright
        [[r,c],[r+1,c],[r+2,c],[r+3,c]], // down
        [[r,c],[r+1,c-1],[r+2,c-2],[r+3,c-3]], // downleft
      ].reduce((acc,cur) => /XMAS|SAMX/.test(cur.map(([r,c]) => {
        return (input[r] ?? [])[c] ?? "."
      }).join('')) ? acc+1:acc, 0)
    })
  })
  return total
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let total = 0
  for (let r = 0; r < input.length -2; r++) {
    for (let c = 0; c < input[0].length -2; c++) {
      if(/MMASS|SSAMM|MSAMS|SMASM/.test(
        [
          [r,c],
          [r,c+2],
          [r+1,c+1],
          [r+2,c],
          [r+2,c+2]
        ].map(([r,c]) => input[r][c]).join('')
      )) {
        total++
      }
    }
  }
  return total
}

run({
  part1: {
    tests: [
      {
        input: `..X...
.SAMX.
.A..A.
XMAS.S
.X....`,
        expected: 4
      },
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
