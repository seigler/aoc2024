import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split('').map(Number)

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let mem: number[] = []
  let space = 0
  for (let i = 0; i < input.length; i+= 2) {
    const [f,s] = input.slice(i,i+2)
    mem.push(...(new Array(f).fill(i/2)))
    mem.push(...(new Array(s).fill(-1)))
    space += s
  }
  for (let from = mem.length - 1; from >= 0; from--) {
    if (mem[from] < 0) continue
    const to = mem.findIndex(x => x < 0)
    if (to === -1 || to > from) break
    mem[to] = mem[from]
    mem[from] = -1
  }
  return mem.reduce((total, b, i) => {
    if (b < 0) return total
    return total + b * i
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let files: number[][] = [] // [index, length]
  let spaces: number[][] = []
  for (let i = 0, cursor = 0; i < input.length; i+= 2) {
    const [f,s] = input.slice(i,i+2)
    files.push([cursor, f])
    cursor += f
    if (s === undefined) continue
    spaces.push([cursor, s])
    cursor += s
  }
  for (let i = files.length - 1; i >= 0; i--) {
    const file = files[i]
    const space = spaces.find(space => space[1] >= file[1])
    spaces.pop() // remove the space to the left of this file, which can no longer be used
    if (space === undefined) {
      continue
    }
    space[1] -= file[1]
    const newSpaceIndex = space[0] + file[1]
    file[0] = space[0]
    space[0] = newSpaceIndex
  }
  return files.reduce((total, [index,length], id) => {
    return total + id * length * (2*index + length - 1) / 2
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
