'use strict';

/**
 * Функция возвращающая треугольник Паскаля
 * @param {Number} numRows - количество строк
 * 
 * @return {Array} - значение функции
 */
module.exports = (numRows) => {
  var pascalTriangle = [];
  
  for (var i = 0; i < numRows; i += 1) { 
    pascalTriangle[i] = new Array(i+1);
    
    for (var j = 0; j < i + 1; j += 1) {            
      if (j === 0 || j === i) {
        pascalTriangle[i][j] = 1;
      } else {
        pascalTriangle[i][j] = pascalTriangle[i-1][j-1] + pascalTriangle[i-1][j];
      }
    }
  }
  
  return pascalTriangle;
}