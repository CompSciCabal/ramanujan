const limit = 120 * 365
const out = []

// some interesting numbers

function pow10() {
  let cur = 1
  let obj = {
    get name() {
      return `10 to the power of ${Math.log10(cur)}`
    },
    get cur() {
      return cur
    },
    next: function() {
      return cur *= 10
    }
  }
  return obj
}

function pow2() {
  let cur = 1
  let obj = {
    get name() {
      return `2 to the power of ${Math.log2(cur)}`
    },
    get cur() {
      return cur
    },
    next: function() {
      return cur *= 2
    }
  }
  return obj
}

function fac() {
  let index = 1
  let cur = 1
  let obj = {
    get name() {
      return `Factorial of ${index}`
    },
    get cur() {
      return cur
    },
    next: function() {
      return cur *= ++index
    }
  }
  return obj
}

function fib() {
  let index = 1
  let prev = 1
  let cur = 1
  let obj = {
    get name() {
      return `Fibonacci of ${index}`
    },
    get cur() {
      return cur
    },
    next: function() {
      index++
      cur = prev + cur
      prev = cur - prev
      return cur
    }
  }
  return obj
}

function tri() {
  let index = 1
  let cur = 1
  let obj = {
    get name() {
      return `Triangle number ${index}`
    },
    get cur() {
      return cur
    },
    next: function() {
      return cur += ++index
    }
  }
  return obj
}

function squares() {
  let index = 1
  let cur = 1
  let obj = {
    get name() {
      return `Square of ${index}`
    },
    get cur() {
      return cur
    },
    next: function() {
      return cur = ++index**2
    }
  }
  return obj
}

// listed in order of "interestingness"

let streams = [ pow10
              , pow2
              , fac
              , fib
              , squares
              , tri
              ]

// TIMING!

let seconds = {
  name:    "seconds",
  start:   day => 24 * 60 * 60 *  day,
  end:     day => 24 * 60 * 60 * (day+1),
  streams: streams.map(s => s())
}

let minutes = {
  name:    "minutes",
  start:   day => 24 * 60 *  day,
  end:     day => 24 * 60 * (day+1),
  streams: streams.map(s => s())
}

let hours = {
  name:    "hours",
  start:   day => 24 *  day,
  end:     day => 24 * (day+1),
  streams: streams.map(s => s())
}

let days = {
  name:    "days",
  start:   day =>  day,
  end:     day => (day+1),
  streams: streams.map(s => s())
}

let weeks = {
  name:    "weeks",
  start:   day => Math.floor(day / 7),
  end:     day => Math.floor((day+1) / 7),
  streams: streams.map(s => s())
}

let months = {
  name:    "months",
  start:   day => Math.floor(12 * day / 365.24),
  end:     day => Math.floor(12 * (day+1) / 365.24),
  streams: streams.map(s => s())
}

let years = {
  name:    "years",
  start:   day => Math.floor(day / 365.24),
  end:     day => Math.floor((day+1) / 365.24),
  streams: streams.map(s => s())
}

let factors = [seconds, minutes, hours, days, weeks, months, years]

for (let day = 0; day < limit; day++) {
  factors.forEach(f => {
    if(f.start(day) === f.end(day))
      return
    f.streams.forEach(s => {
      while (f.start(day) <= s.cur && s.cur < f.end(day)) {
        // out.push({ day, name: `${s.name} ${f.name}`, value: s.cur })
        out.push({ day, type: s.name, time: f.name, value: s.cur })
        s.next()
      }
    })
  })
}

console.log(out)

let el = document.getElementById.bind(document)
el('out').innerHTML = out

let unique = xs => xs.reduce((acc, x, i) => xs.indexOf(x) === i ? acc.concat(x) : acc, [])
let range = n => [...Array(n).keys()]
let missing = (all, some) => all.filter(x => !some.includes(x))

// slow!
// let all_days = range(limit)
// let good_days = unique(out.map(d => d.day))
// let bad_days = missing(all_days, good_days)

// fast!
let all_days = new Set(range(limit))
let good_days = new Set(out.map(d => d.day))
let bad_days = [...all_days.difference(good_days)]

console.log(bad_days)


// TODO:
// maybe pow10 in dog years, cat years, etc? I'm not sure how to do that...
// can also examine other units of time, like time it takes light to get to the nearest stars,
// years on other planets (I'm ten years old on Saturn today!, I'm 1000 Neptunian days old!),
// etc <-- maybe these need a different loop, just for one factor...

// OEIS sequences:
// https://oeis.org/A000396 Perfect numbers
// https://oeis.org/A000108 Catalan numbers
// https://oeis.org/A000668 Mersenne primes
// https://oeis.org/A000578 The cubes
// https://oeis.org/A034897 Hyperperfect numbers
// https://oeis.org/A019279 Superperfect numbers
// https://oeis.org/A006862 Euclid numbers
// https://oeis.org/A000244 pow 3
//