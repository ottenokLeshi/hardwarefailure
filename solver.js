'use strict';

const createPascalTriangle = require('./helpers/pascalTriangle');
const getLaplasianFunc = require('./helpers/laplasianFunc');

/**
 * Функция высчитывающая необходимое количество серверов по количеству процессов
 *
 * @param {Number} N - необходимо количество запущенных процессов конвертации
 * @param {Number} T - общее время на работу
 * @param {Number} t - время конвертации
 * 
 * @return {Number} - минимальное количество серверов
 */
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
 * Функция высчитывающая вероятность
 *
 * @param {Number} N - необходимо количество запущенных процессов конвертации
 * @param {Number} n - количество форматов
 * @param {Number} p - вероятность ошибки во время конвертации
 * 
 * @return {Function} - Функция, возвращающая вероятность успешной конвертации при заданном N
 */
const getProbability = (N, n, p) => {
  /**
   * В случае, когда погрешность при использовании интегральной формулы Лапласа велика,
   * введем массив probabilityArray, в котором будут находиться вероятности удачной конвертации
   * от n до того числа, после которого можно пользоваться формулой Лапласа.
   */
  let probabilityArray = [];
  if (N * p * (1 - p) < 9){
    const arrayLength = Math.ceil(9 / (p * (1 - p)));
    const pascalTriangle = createPascalTriangle(arrayLength + 1);
    for (let i = n; i < arrayLength - 1; i += 1) {
      let probability = 0;
      for (let j = n; j <= i; j += 1) {
        const newProbability = pascalTriangle[i][j] * Math.pow(p, j) * Math.pow((1 - p), i - j);
        probability += newProbability;
      }
      probabilityArray[i] = probability;
    }
  }

  return (N) => {
    if (N < probabilityArray.length) {
      return probabilityArray[N];
    }
    let x1 = (n - N * p)/Math.sqrt(N * p * (1 - p));
    let x2 = (N - N * p)/Math.sqrt(N * p * (1 - p));

    return getLaplasianFunc(x1, x2);
  }
}

/**
 * Экспортируемый модуль
 * 
 * @param {Number} T - общее время на работу
 * @param {Number} t - время конвертации
 * @param {Number} n - количество форматов
 * @param {Number} x - вероятность ошибки во время конвертации в процентах
 * 
 * @return {Number} - минимальное количество серверов
 */
module.exports = (T, t, n, x) => {
  // количество процессов, при запуске которых вероятность меньше 1%
  let N = n;
  // вероятность ошибки конвертации формата
  const p = 1 - x/100;

  if (x === 0){
    return getServersAmount(N, T, t);
  }

  if (x === 100){
    throw new Error('Конвертация невозможна');
  }

  const probability = getProbability(N, n, p);

  while(probability(N) - 0.99 < 0.0001) {
    N += 1;
  }
  return getServersAmount(N, T, t);
}
