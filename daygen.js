const limit = 120 * 365
const out = []

function pow10() {
  let cur = 1
  let obj = {
    name: "Power of 10!",
    get cur() {
        return cur
    },
    next: function() {
      return cur *= 10
    }
  }
  return obj
}

function fac() {
  let index = 1
  let cur = 1
  let obj = {
    name: "Factorial",
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
  let prev = 1
  let cur = 1
  let obj = {
    name: "Fibonacci",
    get cur() {
        return cur
    },
    next: function() {
      cur = prev + cur
      prev = cur - prev
      return cur
    }
  }
  return obj
}

let streams = [ pow10
              , fac
              , fib
              ]

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
        out.push({ day, name: `${s.name} ${f.name}`, value: s.cur })
        s.next()
      }
    })
  })
}



/*

function isPrime(n) {
  const limit = Math.ceil(Math.sqrt(n));
  for (let i = 2; i <= limit; i++) {
    if (n % i == 0) {
      return false;
    }
  }
  return true;
}

function nextPowerOfTen(n) {
  return 10 ** Math.ceil(Math.log10(n));
}

// factorial
// fibanacchi
// triangle numbers
// pizza numbers
// primes


const ageMillis = (nowMillis - bdayMillis);
const seconds = Math.floor(ageMillis / 1000);
const minutes = Math.floor(seconds / 60);
const hours = Math.floor(minutes / 60);
const days = Math.floor(hours / 24);
const weeks = Math.floor(days / 7);
const years = Math.floor(days / 365.24);
const months = Math.floor(12 * days / 365.24);

*/