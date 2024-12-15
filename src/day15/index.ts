import run from "aocrunner"

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
  movements.forEach((move) => {
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

    // console.log(move)
    // map.forEach((row,r) => {
    //   const line = row.map((_, c) => {
    //     const key = getKey(r,c)
    //     if (boxes.has(key)) return "O"
    //     if (walls.has(key)) return "#"
    //     if (rPos === r && cPos === c) return "@"
    //     return " "
    //   }).join('')
    //   console.log(line)
    // })
    // console.log('')
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
 
  movements.forEach((instruction) => {
    const [dr, dc] = deltas[instruction]
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
    const move = (r: number, c: number, dr: number): boolean => {
      const keyAhead = getKey(r + dr, c)
      if (walls.has(keyAhead)) return false
      if (boxes.has(keyAhead)) {
        if (move(r + dr, c, dr) && move(r + dr, c + 1, dr)) {
          toDelete.push(keyAhead)
          toAdd.push(getKey(r+2*dr, c))
          return true
        }
        return false
      }
      const keyLeftAhead = getKey(r + dr, c-1)
      if (boxes.has(keyLeftAhead)) {
        if (move(r + dr, c - 1, dr) && move(r + dr, c, dr)) {
          toDelete.push(keyLeftAhead)
          toAdd.push(getKey(r + 2*dr, c - 1))
          return true
        }
        return false
      }
      return true
    }
    if (move(rPos, cPos, dr)) {
      toDelete.forEach(k => boxes.delete(k))
      toAdd.forEach(k => boxes.add(k))
    } else {
      return
    }

    rPos += dr
    cPos += dc

    // Uncomment to show moves

    // console.log(instruction)
    // map.forEach((row,r) => {
    //   const line = new Array(row.length * 2).fill(0).map((_, c) => {
    //     const key = getKey(r,c)
    //     if (rPos === r && cPos === c) return "@"
    //     if (boxes.has(key)) return "["
    //     if (boxes.has(getKey(r, c-1))) return "]"
    //     if (walls.has(key)) return "#"
    //     return "."
    //   }).join('')
    //   console.log(line)
    // })
    // console.log('')
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
