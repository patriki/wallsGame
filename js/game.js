function Game(options){
  this.rows = options.rows;
  this.columns = options.columns;
  this.player = options.player;
  //this.wall = options.wall;

  this.arrayOfWalls=[];
  this.treasure = [];
  this.score = 0;

  // 1.drawing the board:
  for (var oneRow = 0; oneRow < this.rows; oneRow++){
    for (var oneColumn = 0; oneColumn < this.columns; oneColumn++){
      $('.container').append($('<div>')
        .addClass('square')
        .attr('numberOfRow', oneRow)
        .attr('numberOfCol', oneColumn)
      );
    }
  }

  this._generateTreasures();
  this._drawPlayer();
  //this._drawWall();
  this._movePlayerWithKeys();
  this._generateWall();
}

Game.prototype._generateWall = function () {
  var wall = [];
  var wallLength = Math.floor((Math.random() * 5) + 3); //number between 3 and 8
  var wallRow = Math.floor((Math.random() * 17) + 1);   //number until 18
  wall.length = wallLength;
  for (i = 0; i <= wallLength; i++){
    wall[i] = { col: i,
                     row: wallRow
                   };
    var selector = '[numberOfRow=' + wall[i].row + ']' +
                   '[numberOfCol=' + wall[i].col + ']';
    $(selector).addClass('wall');
  }

  setInterval(this._moveWallRigth.bind(this, wall), 500)
  this.arrayOfWalls.push(wall);
};



Game.prototype._moveWallRigth = function (wall) {
  wall = wall.map(function(cell){
    cell.col += 1;
    return cell;
  });

  var selector = '[numberOfRow=' + wall[wall.length - 1].row + ']' +
                 '[numberOfCol=' + wall[wall.length -1].col + ']';
  $(selector).addClass('wall');

  var oldSelector = '[numberOfRow=' + wall[0].row + ']' +
                 '[numberOfCol=' + (wall[0].col -1) + ']';
  $(oldSelector).removeClass('wall');


};

Game.prototype._moveWallLeft = function (wall) {
  wall = wall.map(function(cell){
    cell.col -= 1;
    return cell;
  });

  var selector = '[numberOfRow=' + wall[0].row + ']' +
                 '[numberOfCol=' + wall[0].col + ']';
  $(selector).addClass('wall');

  var oldSelector = '[numberOfRow=' + wall[wall.length -1].row + ']' +
                 '[numberOfCol=' + (wall[wall.length -1].col + 1) + ']';
  $(oldSelector).removeClass('wall');


};


// 2.drawing the player:
Game.prototype._drawPlayer = function () {

    var selector = '[numberOfRow=' + this.player.body.row + ']' +
                   '[numberOfCol=' + this.player.body.column + ']';
    $(selector).addClass('player');
};
/*
Game.prototype._drawWall = function() {
  this.wall.blocks.forEach(function(position, index) {
    var selector = '[numberOfRow=' + position.row + ']' +
                   '[numberOfCol=' + position.column + ']';

    $(selector).addClass('wall');
  });
};*/

// 3.movement of the player with the keys: move, clear square and draw the new one
Game.prototype._movePlayerWithKeys = function() {
  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 38: // arrow up
        this.player.goUp();
        break;
      case 40: // arrow down
        this.player.goDown();
        break;
      case 37: // arrow left
        this.player.goLeft();
        break;
      case 39: // arrow right
        this.player.goRight();
        break;
    }
    this._collideWithWall();
    this._clearPlayer();
    this._drawPlayer();
    this._foundTreasure();
  }.bind(this));
};

// 4.generate treasures
Game.prototype._generateTreasures = function() {
  for (var i = 0; i < 3; i++){
    this.treasure[i] = {
      row: Math.floor(Math.random() * this.rows),
      column: Math.floor(Math.random() * this.columns)
    };
    var selector = '[numberOfRow=' + this.treasure[i].row + ']' +
                   '[numberOfCol=' + this.treasure[i].column + ']';
    $(selector).addClass('treasure');
  }
};


Game.prototype._collideWithWall = function () {
  for (i = 0; i < this.arrayOfWalls.length; i++){
    for (j = 0; j < this.arrayOfWalls[i].length; j++){
      if (this.player.body.row === this.arrayOfWalls[i][j].row && this.player.body.column === this.arrayOfWalls[i][j].col){
      alert ('you lost');
      }
    }
  }
};

Game.prototype._foundTreasure = function() {
  for (var i = 0; i < this.treasure.length; i++){
    //console.log(this.treasure);
    //console.log('=====');
    if (this.player.body.row === this.treasure[i].row && this.player.body.column === this.treasure[i].column){
      this.score += 25;
      this._clearTreasure(this.treasure[i].row, this.treasure[i].column);
      this._updateScore();
      this.treasure.splice(i,1);
      this._checkLevel();
    }
  }
};

Game.prototype._updateScore = function () {
  document.getElementById("scoreValue").innerHTML = this.score;
};

Game.prototype._checkLevel = function () {
  if(this.score % 75 === 0){
    document.getElementById('levelValue').innerHTML = 'Great! Next level!';
    this._generateTreasures();
    this._generateWall();
  }
};

Game.prototype._clearPlayer = function() {
  $('.player').removeClass('player');
};


Game.prototype._clearTreasure = function(coordinateX, coordinateY) {
  var selector = '[numberOfRow=' + coordinateX + ']' +
                 '[numberOfCol=' + coordinateY + ']';
  $(selector).removeClass('treasure');
};
