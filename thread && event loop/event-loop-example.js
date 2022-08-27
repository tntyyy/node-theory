const fs = require('fs');
const { performance } = require('perf_hooks');

console.log('Init'); // 1 (sync code)

setTimeout(() => {
  console.log('Timer 0 sec'); // 5 (timer-фаза), но быстрее чем Immediate потому что 0 секунд
}, 0);

setTimeout(() => {
  console.log('Timer 1 sec'); // 9 (timer-фаза), но позже чем Immediate потому что не успевает выполнится за проход стека вызовов
}, 1000);

setImmediate(() => {
  console.log('Immediate'); // 7 (check-фаза)
});

fs.readFile(__filename, () => {
  console.log('File Read') // 8 (poll-фаза)
});

setTimeout(() => {
  for (let i = 0; i < 100000000; i++) {

  }
  console.log('Cycle done!') // 6 (poll-фаза)  ресурсоемкая задача 
}, 0);

Promise.resolve().then(() => {
  console.log('Promise done!'); // 4 потому что это микротаска, которая находится МЕЖДУ каждой фазы event loop`a!
})

process.nextTick(() => {
  console.log('Next tick!'); // 3 сначала nextTick потом microtask
});

console.log('Final'); // 2 (sync code)

// Все логи: 
// 1 - Init
// 2 - Final
// 3 - Next tick!
// 4 - Promise done!
// 5 - Timer 0 sec
// 6 - Cycle done!
// 7 - Immediate
// 8 - File Read
// 9 - Timer 1 sec