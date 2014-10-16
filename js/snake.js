var Position = (function () {
  var position = function(x, y) {
    this.x = x;
    this.y = y;
    this.toArray = [x, y];
  };

  return function (x, y) {
    return new position(x, y);
  };
})();


var Snake = (function () {
  var snake = function (pieces) {
    this.pieces = pieces;
  };

  return function (pieces) {
    return new snake(pieces);
  };
})();
