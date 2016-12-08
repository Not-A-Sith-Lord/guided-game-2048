function Game2048 () {
  this.board = [
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
  ];

  this.score  = 0;
  this.won    = false;
  this.lost   = false;
  this._generateTile();
  this._generateTile();
}

Game2048.prototype._renderBoard = function () {
  this.board.forEach(function(row){ console.log(row); });
  console.log('Score: ' + this.score);
};

Game2048.prototype._generateTile = function () {
  var initialValue = (Math.random() < 0.8) ? 2 : 4;
  var emptyTile = this._getAvailablePosition();

  if (emptyTile) { this.board[emptyTile.x][emptyTile.y] = initialValue; }
};

Game2048.prototype._getAvailablePosition = function () {
  var emptyTiles = [];

  this.board.forEach(function(row, rowIndex){
    row.forEach(function(elem, colIndex){
      if (!elem) emptyTiles.push({ x: rowIndex, y: colIndex });
    });
  });

  // Fix this... emptyTiles.length is never === 0
  // Working with _getAvailablePosition in application.js
  this.lost = (emptyTiles.length === 0);

  if (this.lost) {
    return false;
  }
  var randomPosition = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomPosition];
};

Game2048.prototype._moveLeft = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) { return i !== null; });

    for(i = 0; i < newRow.length - 1; i++) {
      if (newRow[i+1] === newRow[i]) {
        ion.sound.play("tap");
        newRow[i]   = newRow[i] * 2;
        newRow[i+1] = null;

        that._updateScore(newRow[i]);
      }
    }

    var merged = newRow.filter( function (i) { return i !== null; });
    while(merged.length < 4) { merged.push(null); }
    if (newRow.length !== row.length) boardChanged = true;

    newBoard.push(merged);
  });

  this.board = newBoard;
  return boardChanged;
};

Game2048.prototype._moveRight = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) { return i !== null; });

    for (i=newRow.length - 1; i>0; i--) {
      // If two adjacent tiles are equal, we collapse them and double value!
      if (newRow[i-1] === newRow[i]) {
        ion.sound.play("tap");
        newRow[i]   = newRow[i] * 2;
        newRow[i-1] = null;
        that._updateScore(newRow[i]);
      }
      if (newRow.length !== row.length) boardChanged = true;
    }

    var merged = newRow.filter( function (i) { return i !== null; });
    while(merged.length < 4) { merged.unshift(null); }
    newBoard.push(merged);
  });

  this.board = newBoard;
  return boardChanged;
};

Game2048.prototype._moveUp = function () {
  this._transposeMatrix();
  var boardChanged = this._moveLeft();
  this._transposeMatrix();
  return boardChanged;
};

Game2048.prototype._moveDown = function () {
  this._transposeMatrix();
  var boardChanged = this._moveRight();
  this._transposeMatrix();
  return boardChanged;
};

Game2048.prototype.move = function (direction) {
  ion.sound.play("snap");
  if (!this.won) {
    switch (direction) {
      case "up":    boardChanged = this._moveUp();    break;
      case "down":  boardChanged = this._moveDown();  break;
      case "left":  boardChanged = this._moveLeft();  break;
      case "right": boardChanged = this._moveRight(); break;
    }

    if (boardChanged)
    this._generateTile();
  }

  // this._renderBoard();
};

Game2048.prototype._transposeMatrix = function() {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};

Game2048.prototype.win = function() {
  return (this.won);
};

Game2048.prototype.lost = function() {
  return (this.lost);
};

Game2048.prototype._updateScore = function(value) {
  this.score += value;
  if (value === 2048) {
    this.won = true;
  }
};
