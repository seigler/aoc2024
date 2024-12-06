import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split('\n')

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const rawCol = rawInput.indexOf('^')
  let width = rawInput.indexOf('\n')
  let position = [Math.floor(rawCol / (width + 1)), rawCol % (width + 1)]
  let visited = new Set<string>()
  const directions = [
    [-1,0],
    [0,1],
    [1,0],
    [0,-1]
  ]
  let dir = 0
  while(true) {
    visited.add(position.join())
    const nextPosition = [position[0] + directions[dir][0], position[1] + directions[dir][1]]
    const next = (input[nextPosition[0]] ?? [])[nextPosition[1]]
    if (next === undefined) {
      break // done!
    }
    if (next === "#") {
      dir = (dir + 1) % 4
      continue
    }
    position = nextPosition
  }
  return visited.size
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const rawCol = rawInput.indexOf('^')
  let width = rawInput.indexOf('\n')
  const directions = [
    [-1,0],
    [0,1],
    [1,0],
    [0,-1]
  ]
  let obstructions = new Set<string>()
  const walk = (
    initialPosition: number[],
    tempObstacle?: [number, number],
    initialVisited = new Set<string>,
    initialDir = 0
  ) => {
    let position = [...initialPosition]
    let visited = new Set(initialVisited)
    let dir = initialDir
    while(true) {
      const key = [...position, dir].join()
      if (visited.has(key)) {
        // we have entered a loop!
        obstructions.add(tempObstacle.join())
        return
      }
      const nextPosition: [number, number] = [position[0] + directions[dir][0], position[1] + directions[dir][1]]
      const next = (input[nextPosition[0]] ?? [])[nextPosition[1]]
      if (next === undefined) {
        // we are done!
        return obstructions.size
      }
      if (tempObstacle == null && next != "#" && !obstructions.has(nextPosition.join())) {
        walk(position, nextPosition, visited, dir)
      }
      visited.add(key)
      if (next === "#" || (tempObstacle != null && nextPosition.join() === tempObstacle.join())) {
        dir = (dir + 1) % 4
        continue
      }
      position = nextPosition
    }
  }
  return walk([Math.floor(rawCol / (width + 1)), rawCol % (width + 1)])
}

run({
//   part1: {
//     tests: [
//       {
//         input: `....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`,
//         expected: 41,
//       },
//     ],
//     solution: part1,
//   },
  part2: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
