import run from "aocrunner"

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map(line => line.split(''))
}

const directions = ["down","right","dl","dr"] as const
type Direction = typeof directions[number]
type Prospect1 = {
  letters: string
  direction: Direction
  next: [number, number]
}
type Coord = Prospect1['next']
const getNext = (dir: Direction, [row, col]: Coord): Coord => {
  switch(dir) {
    case "down": {return [row+1, col]}
    case "right": {return [row, col+1]}
    case "dl": {return [row+1, col-1]}
    case "dr": {return [row+1, col+1]}
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let total = 0
  let prospects: Prospect1[] = []
  input.forEach((line, row) => {
    line.forEach((letter, col) => {
      prospects = prospects.map((prospect) => {
        const {
          direction,
          letters,
          next
        } = prospect
        if (next[0] < row) return null
        if (next[0] === row && next[1] === col) {
          const nextLetters = letters + letter
          if (["XMAS","SAMX"].includes(nextLetters)) {
            total += 1
            return null
          }
          if (["XMA","SAM","XM","SA"].includes(nextLetters)) {
            return {
              letters: nextLetters,
              direction: direction,
              next: getNext(direction, next)
            }
          }
        }
        return prospect
      }).filter(prospect => prospect != null)
      if ("XMAS".includes(letter)) {
        directions.forEach(direction => {
          prospects.push({
            letters: letter,
            direction,
            next: getNext(direction, [row, col])
          })
        })
      }
    })
  })
  return total
}

type Prospect2 = {
  letters: string
  direction: Direction
  next: [number, number]
  center: [number, number]
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let centers = new Map<string, number>()
  let prospects: Prospect2[] = []
  let total = 0
  input.forEach((line, row) => {
    line.forEach((letter, col) => {
      prospects = prospects.map((prospect) => {
        const {
          direction,
          letters,
          next
        } = prospect
        if (next[0] < row) return null
        if (next[0] === row && next[1] === col) {
          const nextLetters = letters + letter
          if (["MAS","SAM"].includes(nextLetters)) {
            const key = prospect.center.join(",")
            if (centers.has(key)) { total++ }
            centers.set(key, 1)
            return null
          }
          if (["MA","SA"].includes(nextLetters)) {
            return {
              ...prospect,
              letters: nextLetters,
              next: getNext(direction, next),
            }
          }
        }
        return prospect
      }).filter(prospect => prospect != null)
      if ("XMAS".includes(letter)) {
        ["dl" as const, "dr" as const].forEach(direction => {
          const center = getNext(direction, [row, col])
          prospects.push({
            letters: letter,
            direction,
            next: center,
            center,
          })
        })
      }
    })
  })
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
  onlyTests: false,
})
