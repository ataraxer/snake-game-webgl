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
  var snake = function (fieldSize, pieces) {
    this.pieces = pieces;

    this.direction = [1, 0];

    this.right = function () {
      var x = this.direction[0];
      var y = this.direction[1];

      var newY = x * -1;
      var newX = y;

      var newDirection = [newX, newY];
      this.direction = newDirection;
    };

    this.left = function () {
      var x = this.direction[0];
      var y = this.direction[1];

      var newY = x;
      var newX = y * -1;

      var newDirection = [newX, newY];
      this.direction = newDirection;
    };

    this.head = function () {
      return this.pieces[this.pieces.length - 1];
    };

    this.move = function () {
      var head = this.head();

      var newX = head.x + this.direction[0];
      var newY = head.y + this.direction[1];

      if (newX >= fieldSize) newX = 0;
      if (newY >= fieldSize) newY = 0;
      if (newX < 0) newX = fieldSize - 1;
      if (newY < 0) newY = fieldSize - 1;

      var newHead = Position(newX, newY);

      this.pieces.push(newHead);
      this.pieces.shift();

      return newHead;
    };
  };

  return function (fieldSize, pieces) {
    return new snake(fieldSize, pieces);
  };
})();
