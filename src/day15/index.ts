import run from "aocrunner"
import * as readline from "readline"

type Coord = [number, number]

const getKey = (r: number, c: number) => {
  return r * 100 + c
}
type Key = ReturnType<typeof getKey>

const deltas: Record<string, Coord> = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
}

const part1 = (rawInput: string) => {
  // Parsing
  const [rawMap, rawMovements] = rawInput.split("\n\n")
  const map = rawMap.split("\n").map(line => line.split(''))
  let start: Coord
  let boxes = new Set<Key>()
  const walls = new Set<Key>()
  map.forEach((line, r) => {
    line.forEach((cell, c) => {
      const key = getKey(r, c)
      if (cell === "O") {
        boxes.add(key)
      }
      if (cell === "@") {
        start = [r, c]
      }
      if (cell === "#") {
        walls.add(key)
      }
    })
  })
  const movements = rawMovements.replaceAll("\n", "").split("")

  // Solving
  let [rPos, cPos] = start
  movements.forEach((move, moveNum) => {
    const [dr, dc] = deltas[move]
    for (let i = 1; ; i++) {
      const key = getKey(rPos + dr * i, cPos + dc * i)
      if (walls.has(key)) return // no space before hitting wall, do nothing
      if (boxes.has(key)) continue // only boxes so far
      // an open space!
      if (i > 1) {
        boxes.delete(getKey(rPos+dr, cPos+dc))
        boxes.add(key)
        break
      }
      break
    }
    rPos += dr
    cPos += dc

    // Uncomment to show moves
    
    // if (moveNum > 0) {
    //   readline.moveCursor(process.stdout, 0, - map.length - 1)
    // }
    // console.log(move)
    // const canvas: string[] = []
    // map.forEach((row,r) => {
    //   const line = row.map((_, c) => {
    //     const key = getKey(r,c)
    //     if (boxes.has(key)) return "\x1b[33;1mO\x1b[0m"
    //     if (walls.has(key)) return "\x1b[30;100m \x1b[0m"
    //     if (rPos === r && cPos === c) return "\x1b[96m@\x1b[0m"
    //     return " "
    //   }).join('')
    //   canvas.push(line)
    // })
    // console.log(canvas.join('\n'))
  })

  return Array.from(boxes.values()).reduce((total, b) => total + b, 0)
}

const part2 = (rawInput: string) => {
  // Parsing
  const [rawMap, rawMovements] = rawInput.split("\n\n")
  const map = rawMap.split("\n").map(line => line.split(''))
  let start: Coord
  let boxes = new Set<Key>()
  const walls = new Set<Key>()
  map.forEach((line, r) => {
    line.forEach((cell, c) => {
      const key = getKey(r, c * 2)
      if (cell === "O") {
        boxes.add(key)
      }
      if (cell === "@") {
        start = [r, c * 2]
      }
      if (cell === "#") {
        walls.add(key)
        walls.add(getKey(r, 2 * c + 1))
      }
    })
  })
  const movements = rawMovements.replaceAll("\n", "").split("")

  // Solving
  let [rPos, cPos] = start
 
  movements.forEach((move, moveNum) => {
    const [dr, dc] = deltas[move]
    if (dr === 0) { // horizontal movement
      for (let i = 1; ; i++) {
        const key = getKey(rPos, cPos + dc * i)
        if (walls.has(key)) return // no space before hitting wall, do nothing
        if (dc > 0 && boxes.has(key)) {
          i++
          continue
        }
        if (dc < 0 && boxes.has(getKey(rPos, cPos - i - 1))) {
          i++
          continue
        }
        // an open space!
        if (i > 1) {
          for (let j = 1; j < i; j += 2) {
            const offset = dc < 0 ? 1 : 0
            boxes.delete(getKey(rPos, cPos+(j+offset)*dc))
            boxes.add(getKey(rPos, cPos+(j+offset+1)*dc))
          }
          break
        }
        break
      }
    }
    // vertical movement, dc is 0

    const toDelete: Key[] = []
    const toAdd: Key[] = []
    // solve this with recursion!
    const push = (r: number, c: number, dr: number): boolean => {
      const keyAhead = getKey(r + dr, c)
      if (walls.has(keyAhead)) return false
      if (boxes.has(keyAhead)) {
        if (push(r + dr, c, dr) && push(r + dr, c + 1, dr)) {
          toDelete.push(keyAhead)
          toAdd.push(getKey(r+2*dr, c))
          return true
        }
        return false
      }
      const keyLeftAhead = getKey(r + dr, c-1)
      if (boxes.has(keyLeftAhead)) {
        if (push(r + dr, c - 1, dr) && push(r + dr, c, dr)) {
          toDelete.push(keyLeftAhead)
          toAdd.push(getKey(r + 2*dr, c - 1))
          return true
        }
        return false
      }
      return true
    }
    if (push(rPos, cPos, dr)) {
      toDelete.forEach(k => boxes.delete(k))
      toAdd.forEach(k => boxes.add(k))
    } else {
      return
    }

    rPos += dr
    cPos += dc

    // Uncomment to show moves

    // if (moveNum > 0) {
    //   readline.moveCursor(process.stdout, 0, - map.length - 1)
    // }
    // console.log(move)
    // const canvas: string[] = []
    // map.forEach((row,r) => {
    //   const line = new Array(row.length * 2).fill(0).map((_, c) => {
    //     const key = getKey(r,c)
    //     if (rPos === r && cPos === c) return "\x1b[96m@\x1b[0m"
    //     if (boxes.has(key)) return "\x1b[33;1m[\x1b[0m"
    //     if (boxes.has(getKey(r, c-1))) return "\x1b[33;1m]\x1b[0m"
    //     if (walls.has(key)) return "\x1b[30;100m \x1b[0m"
    //     return " "
    //   }).join('')
    //   canvas.push(line)
    // })
    // console.log(canvas.join('\n'))
  })
  return Array.from(boxes.values()).reduce((total, b) => total + b, 0)
}

run({
  part1: {
    tests: [
      {
        input: `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
        expected: 2028,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`,
        expected: 618,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
