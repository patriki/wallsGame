var game;

$(document).ready(function() {
  game = new Game({
    rows: 20,
    columns: 10,
    player: new Player(),
  });
});
