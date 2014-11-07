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

    this.direction = [1, 0];

    this.head = function () {
      return this.pieces[this.pieces.length - 1];
    };

    this.move = function () {
      var head = this.head();

      var newHead = Position(
        head.x + this.direction[0],
        head.y + this.direction[1]);

      this.pieces.push(newHead);
      this.pieces.shift();

      return newHead;
    };
  };

  return function (pieces) {
    return new snake(pieces);
  };
})();
