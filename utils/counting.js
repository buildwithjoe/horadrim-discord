const math = require('mathjs');
module.exports = function (mathProblem, expectedCount) {
  const result = math.evaluate(mathProblem);

  return result === expectedCount;
};
