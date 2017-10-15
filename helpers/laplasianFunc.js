'use strict';

const numbers = require('numbers');

/**
 * Функция необходимое для вычисление функции Лапласа значение
 * @param {Number} x - аргумент функиции
 * 
 * @return {Number} - значение функции
 */
const laplasianFunc = (x) => {
  return Math.exp(-(x * x)/2);
}

/**
 * Функция высчитывающая функцию Лапласа
 *
 * @param {Number} x1 - аргумент функиции
 * @param {Number} x2 - аргумент функиции
 * 
 * @return {Number} - минимальное количество серверов
 */
const getLaplasianFunc = (x1, x2) => {
  const integral = numbers.calculus.Riemann(laplasianFunc, x1, x2, 200, 0.0001);
  const result = integral/(Math.sqrt(2 * Math.PI))

  return result;  
}

module.exports = getLaplasianFunc;