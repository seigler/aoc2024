import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split("\n")
.map((l) => Array.from(l.matchAll(/-?\d+/g)).map(Number))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const width = 101
  const height = 103
  let quadrantCounts = [0,0,0,0] // TL, TR, BR, BL
  const halfX = (width - 1) / 2
  const halfY = (height - 1) / 2
  input.forEach(([ix, iy, dx, dy]) => {
    const destx = (ix + (width + dx) * 100) % width
    const desty = (iy + (height + dy) * 100) % height
    if (desty === halfY || destx === halfX) { return }
    quadrantCounts[
      (desty > halfY ? 2 : 0) + (destx > halfX ? 1 : 0)
    ] += 1
  })
  return quadrantCounts.reduce((total, here) => {
    return total * here
  }, 1)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const width = 101
  const height = 103
  for (let i = 0; i < width * height; i++) {
    const canvas: string[][] = []
    for (let y = 0; y < height; y++) {
      canvas.push(" ".repeat(width).split(''))
    }
    input.forEach(([ix, iy, dx, dy]) => {
      const destx = (ix + (width + dx) * i) % width
      const desty = (iy + (height + dy) * i) % height
      canvas[desty][destx] = "#"
    })
    if (canvas.some(line => line.join('').includes("##########"))) {
      console.log(`\nTIME: ${i} seconds\n${canvas.map(line => console.log(line.join(""))).join('\n')}`)
      return i
    }
  }
}

run({
  part1: {
    tests: [
//       {
//         input: `p=0,4 v=3,-3
// p=6,3 v=-1,-3
// p=10,3 v=-1,2
// p=2,0 v=2,-1
// p=0,0 v=1,3
// p=3,0 v=-2,-2
// p=7,6 v=-1,-3
// p=3,0 v=-1,-2
// p=9,3 v=2,3
// p=7,3 v=-1,2
// p=2,4 v=2,-3
// p=9,5 v=-3,-3`,
//         expected: 12,
//       },
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
