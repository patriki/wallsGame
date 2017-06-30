function Wall(speed){
  this.body = [];
  this.direction = "right";
  this.speedWall = speed;
}

Wall.prototype.addCell = function(cell){
  this.body.push(cell);
};

function Game(options){
  this.rows = options.rows;
  this.columns = options.columns;
  this.player = options.player;
  //this.wall = options.wall;
  //this.direction = "right";

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
  this._movePlayerWithKeys();
  this._generateWall();
}

Game.prototype._generateWall = function () {
  var speedRandom = (Math.floor((Math.random() * 8) + 2)) * 100;
  var wall = new Wall(speedRandom);
  var wallLength = Math.floor((Math.random() * 5) + 3); //number between 3 and 8
  var wallRow = Math.floor((Math.random() * 17) + 1);   //number until 18
  console.log(this.arrayOfWalls.length);
  if (this.arrayOfWalls.length >= 1){
    for (var i = 0; i < this.arrayOfWalls.length; i++){
      if (wallRow === this.arrayOfWalls[i].body[0].row){
        wallRow = Math.floor((Math.random() * 17) + 1);
      }
      // do{
      //     wallRow = Math.floor((Math.random() * 17) + 1);
      // } while (wallRow === this.arrayOfWalls[i].body[0].row);
    }
  }

  for (i = 0; i <= wallLength; i++){
    wall.addCell({ col: i, row: wallRow});
    var selector = '[numberOfRow=' + wall.body[i].row + ']' +
                   '[numberOfCol=' + wall.body[i].col + ']';
    $(selector).addClass('wall');
    console.log(wall);
  }
  console.log(wall.speedWall);
  setInterval(this._directionSwitcher.bind(this, wall), wall.speedWall);
  this.arrayOfWalls.push(wall);
  wall.speedWall += 200;
};

Game.prototype._directionSwitcher = function (wall) {
  // console.log(wall[0].col)
  if (wall.body[0].col === 0 ) {
    wall.direction = "right";
  }else if(wall.body[wall.body.length - 1].col === 9){
    wall.direction = "left";
  }

  if (wall.direction === "right") {
    this._moveWallRight(wall);
  } else {
    this._moveWallLeft(wall);
  }
  // console.log(this.direction);
};



Game.prototype._moveWallRight = function (wall) {
  this._collideWithWall();

  wall = wall.body.map(function(cell){
    cell.col += 1;
    return cell;
  }.bind(this));

  var selector = '[numberOfRow=' + wall[wall.length - 1].row + ']' +
                 '[numberOfCol=' + wall[wall.length -1].col + ']';
  $(selector).addClass('wall');

  var oldSelector = '[numberOfRow=' + wall[0].row + ']' +
                 '[numberOfCol=' + (wall[0].col -1) + ']';
  $(oldSelector).removeClass('wall');


};

Game.prototype._moveWallLeft = function (wall) {
  this._collideWithWall();

  wall = wall.body.map(function(cell){
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
    for (j = 0; j < this.arrayOfWalls[i].body.length; j++){
      if (this.player.body.row === this.arrayOfWalls[i].body[j].row && this.player.body.column === this.arrayOfWalls[i].body[j].col){

        $(".background-darkener-nice").fadeIn(1000);
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
    setTimeout(function(){$("#levelValue").text("")}, 1000);
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
