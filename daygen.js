const limit = 120 * 365
const out = []
let by_day = {}

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

let streams = [ pow10 // log(n) abundance
              , pow2  // log(n) abundance
              , fac   // much smaller than log(n) abundance
              , fib   // log(n) abundance
              , squares // n^()1/2 abundance
              , tri     // n^()1/2 abundance
              ]

//TIMING!

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

let factors = [years, months, weeks, days, hours, minutes, seconds]

for (let day = 0; day < limit; day++) {
  factors.forEach((f, fi) => {
    if(f.start(day) === f.end(day))
      return
    f.streams.forEach((s, si) => {
      while (f.start(day) < s.cur && s.cur <= f.end(day)) {
        // out.push({ day, name: `${s.name} ${f.name}`, value: s.cur })
        out.push({ day, type: s.name, time: f.name, value: s.cur, dis: dinterestingness(fi, si) })
        s.next()
      }
    })
  })
}

by_day = out.reduce((acc, e) => {acc[e.day] = (acc[e.day]||[]).concat(e); return acc}, {})

console.log(out)

let el = document.getElementById.bind(document)
el('out').innerHTML = out

let interesting_limit = 8
let upcoming_limit = 100

el('bday').addEventListener('change', e => {
  // console.log(e)
  let ts = e.target.valueAsNumber
  let t  = (new Date()).getTime()
  let day = Math.floor((t - ts) / 1000 / 60 / 60 / 24)
  let today = by_day[day]
  el('today').innerHTML = JSON.stringify(today, 2, 2)
  // anything interesting coming up?
  upcoming()
})

function upcoming() {
  let ts = el('bday').valueAsNumber
  let t  = (new Date()).getTime()
  let day = Math.floor((t - ts) / 1000 / 60 / 60 / 24)
  let today = by_day[day]
  let interesting_things = []
  for(let i = 0; i<upcoming_limit; i++) {
    interesting_things = interesting_things.concat(by_day[day+i].filter(e => e.dis <= interesting_limit))
  }
  interesting_things = interesting_things.map(e => {
    e.date = new Date(ts + e.day*24*60*60*1000)
    return e
  })
  el('upcoming').innerHTML = JSON.stringify(interesting_things.sort((a, b) => a.dis-b.dis), 2, 2)
}

el('intlimit').addEventListener('change', e => {
  interesting_limit = e.target.value
  upcoming()
})

el('uplimit').addEventListener('change', e => {
  upcoming_limit = e.target.value
  upcoming()
})

// TODO: increase interestingness of e.g. square of 50
function dinterestingness(factor, stream) {
  return (factor+1) * (stream+1)
}


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
// taxicab numbers!
// maybe pow10 in dog years, cat years, etc? I'm not sure how to do that...
// can also examine other units of time, like time it takes light to get to the nearest stars,
// years on other planets (I'm ten years old on Saturn today!, I'm 1000  ()slightly less abundant than loNeptunian days old!),
//g(n)/ etc <-- maybe these) need a different loop, just for one factor...

// OEIS sequences:
// https://oei (n^(1/3) abundance)s.org/ (abundance somewhere between log(n) and the abundance of perfect numberA000396 Perfect numbers
// https://oeis.org/A000108 Catalan numbers
// https://oeis.org/A000668 Mersenne primes
// https: (log(n) abun)ance//oeis.org/A000578 The cubes
// https://oeis.org/A034897 Hyperperfect numbers
// https://oeis.org/A019279 Superperfect numbers
// https://oeis.org/A006862 Euclid numbers
// https://oeis.org/A000244 pow 3
//