var numbers = require('numbers');

const laplasianFunc = (x) => {
  return Math.exp(-(x * x)/2);
}

const getLaplasianFunc = (x1, x2) => {
  const integral = numbers.calculus.Riemann(laplasianFunc, x1, x2, 200, 0.0001);
  const result = integral/(Math.sqrt(2 * Math.PI))

  return result;  
}

const getServersAmount = (N, T, t) => {
  let serversAmount = 0
  if (Math.trunc(T/2) > t) {
    serversAmount = Math.ceil((N * t)/T);
  } else {
    serversAmount = N;
  }
  return serversAmount;
}

/**
 * Функция высчитывающая необходимое количество серверов
 * 
 * @param {Number} T - общее время на работу
 * @param {Number} t - время конвертации
 * @param {Number} n - количество форматов
 * @param {Number} x - вероятность ошибки во время конвертации
 * 
 * @return {Number} - минимальное количество серверов
 */
module.exports = (T, t, n, x) => {
  // количество процессов, при запуске которых вероятность меньше 1%
  let N = n;
  // вероятность ошибки конвертации формата
  const p = 1 - x/100;

  if (x === 0){
    getServersAmount(N, T, t);
  }

  if (x === 100){
    throw new Error('Конвертация невозможна');
  }

  let x1 = (n - N * p)/Math.sqrt(N * p * (1-p))
  let x2 = (N - N * p)/Math.sqrt(N * p * (1-p))

  while(getLaplasianFunc(x1, x2) - 0.99 < 0.0001) {
    N += 1;
    x1 = (n - N * p)/Math.sqrt(N*p*(1-p))
    x2 = (N - N * p)/Math.sqrt(N*p*(1-p))
  }

  return getServersAmount(N, T, t);
}