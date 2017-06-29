
function Player(){
  
  this.body = {row: 0,
              column: 0}; //posicion inicial
}

// movement of the player:
Player.prototype.goRight = function() {
  if (this.body.column < 9){
    this.body.column +=1;
  } else {
    this.body.column = 9;
  }
};
Player.prototype.goDown = function() {
  if (this.body.row < 19){
    this.body.row +=1;
  } else {
    this.body.row = 19;
  }
};
Player.prototype.goLeft = function() {
  if (this.body.column > 0){
    this.body.column -=1;
  } else {
    this.body.column = 0;
  }
};

Player.prototype.goUp = function() {
  if (this.body.row > 0){
    this.body.row -=1;
  } else {
    this.body.row = 0;
  }
};
