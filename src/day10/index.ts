import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split('').map(Number))

const directions = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1] // left
]

const sum = (a,b) => a + b

const getKey = (r: number, c: number) => `${r},${c}`
type Key = ReturnType<typeof getKey>

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const trailheads: Key[] = []
  const exitsMap = new Map<Key, Key[]>()
  const get = (r: number, c: number) => {
    return (input[r] ?? [])[c]
  }
  input.forEach((row, r) => {
    row.forEach((alt, c) => {
      const key = getKey(r, c)
      if (alt === 0) {
        trailheads.push(key)
      }
      const outs: Key[] = []
      directions.forEach(([dr, dc]) => {
        if (get(r + dr, c + dc) === alt + 1) {
          outs.push(getKey(r + dr, c + dc))
        }
      })
      exitsMap.set(key, outs)
    })
  })
  const reachablePeaks = new Map<Key, Set<Key>>()
  const hike = (key: Key, alt: number = 0): Set<Key> => {
    let ans = reachablePeaks.get(key)
    if (ans !== undefined) return ans
    ans = new Set<Key>()
    if (alt === 9) {
      ans.add(key)
      reachablePeaks.set(key, ans)
      return ans
    }
    const branches = (exitsMap.get(key) ?? []).map(k => hike(k,alt+1))
    branches.forEach(peaks => {
      peaks.forEach(peak => ans.add(peak))
    })
    reachablePeaks.set(key, ans)
    return ans
  }
  return trailheads.map(t => hike(t).size).reduce(sum, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const trailheads: Key[] = []
  const exitsMap = new Map<Key, Key[]>()
  const get = (r: number, c: number) => {
    return (input[r] ?? [])[c]
  }
  input.forEach((row, r) => {
    row.forEach((alt, c) => {
      const key = getKey(r, c)
      if (alt === 0) {
        trailheads.push(key)
      }
      const outs: Key[] = []
      directions.forEach(([dr, dc]) => {
        if (get(r + dr, c + dc) === alt + 1) {
          outs.push(getKey(r + dr, c + dc))
        }
      })
      exitsMap.set(key, outs)
    })
  })
  const cache = new Map<Key, number>()
  const hike = (key: Key, alt: number): number => {
    if (alt === 9) {
      return 1
    }
    let ans = cache.get(key)
    if (ans !== undefined) return ans
    const exitTotals = (exitsMap.get(key) ?? []).map(k => hike(k,alt+1))
    ans = exitTotals.reduce(sum, 0)
    cache.set(key, ans)
    return ans
  }
  return trailheads.map(t => hike(t,0)).reduce(sum, 0)
}

run({
  part1: {
    tests: [
      {
        input: `0123
1234
8765
9876`,
        expected: 1,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `012345
123456
234567
345678
4.6789
56789.`,
expected: 227
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
