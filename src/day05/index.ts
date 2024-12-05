import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const [a,b] = rawInput.split('\n\n')
  return {
    rules: a.split('\n').map(rule => rule.split('|').map(Number)),
    updates: b.split('\n').map(update => update.split(',').map(Number))
  }
}

const part1 = (rawInput: string) => {
  const {rules, updates} = parseInput(rawInput)
  return updates.reduce((total, update) => {
    let seen: number[] = []
    for (const page of update) {
      if (rules.some(rule => seen.includes(rule[1]) && rule[0] === page)) {
        return total
      }  
      seen.push(page)
    }
    return total + seen[Math.floor(seen.length / 2)]
  }, 0)
}

const part2 = (rawInput: string) => {
  const {rules, updates} = parseInput(rawInput)
  return updates.reduce((total, update) => {
    let seen: number[] = []
    for (const page of update) {
      if (rules.some(rule => seen.includes(rule[1]) && rule[0] === page)) {
        // needs fixing
        const sortedUpdate = update.sort((p1,p2) => {
          return rules.some(rule => rule[0] === p1 && rule[1] === p2) ? -1 : 1
        })
        return total + update[Math.floor(update.length / 2)]
      }  
      seen.push(page)
    }
    // it's fine
    return total
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
