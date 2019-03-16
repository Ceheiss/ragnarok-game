// players
const player1 = {
  position: {
    x: 0,
    y: 0
  }
}

const player2 = {
  position: {
    x: 0,
    y: 0
  }
}

// Generate grid with blocks
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    $('.grid-container').append('<div class="grid-item" data-y='+i+' data-x='+j+'>Block at x='+j+' y='+i+'</div>')
  }
}

function getPlayerPosition(){
  $('.grid-item').each(function(){
    const element = $(this);
    // I take the coordinates of the
    if (element.hasClass("player-1")) {
      player1.position.x = this.dataset['x'];
      console.log("player1 X position is: ", player1.position.x)
      player1.position.y = this.dataset['y'];
      console.log("player1 Y position is: ", player1.position.y)
    }
    if (element.hasClass("player-2")) {
      player2.position.x = this.dataset['x'];
      player2.position.y = this.dataset['y'];
    }
  })
}

// Generate random numbers
let player1Turn = true;
const generateRandomNum = () => Math.floor(Math.random() * 10);

// Clean all the board
function reset() {
  $('.grid-item').each(function(){
    const element = $(this);
    element.removeClass("block");
    element.removeClass("weapon");
    element.removeClass("player-1");
    element.removeClass("player-2");
    element.removeClass("unavailable");
  })
}

function playerReset(player) {
  $('.grid-item').each(function(){
    const element = $(this);
    element.removeClass(player);
  })
}

// This functions helps blocks, weapons and players find an available aquare in the board
function placeElements(className) {
  const random_x = generateRandomNum();
  const random_y = generateRandomNum();
  $('.grid-item').each(function(){
    const element = $(this);
    //console.log("$(this), this",$(this), this);
    if (this.dataset['x'] == random_x && this.dataset['y'] == random_y) {
      if (!(this.classList.contains("unavailable"))){
        console.log("available");
        element.addClass(className);
        element.addClass("unavailable");
        if (className === "player-1") {
          player1.position.x = this.dataset['x'];
          player1.position.y = this.dataset['y'];
        } else if (className === "player-1"){
          player2.position.x = this.dataset['x'];
          player2.position.y = this.dataset['y'];
        }
      } else {
        console.log("unavailable");
        // Function calls itself recursively until it finds available space
        placeElements(className);
      }
    }
  })
}

// Iterates different elements to display them on the board
function generate(func, times){
    for (let i = 0; i < Number(times); i++) {
      func();
    }
}

// This functions generates que board calling on the diferent pieces
function generateGame(){
  reset();
  // Anonymous functions so I can pass the parameters to the function without calling it
  generate(function(){
    placeElements("block");
  },12)
  generate(function(){
    placeElements("weapon");
  },4)
  generate(function(){
    placeElements("player-1");
  },1)
  generate(function(){
    placeElements("player-2");
  },1)
  movePlayer1();
  movePlayer2();
}

// Blocks console.log their location
$('.grid-item').click(function(){
  console.log(`Coordenada X es ${this.dataset['x']}\nCoordenada Y es ${this.dataset['y']}`);
})

// To move character, put conditionals to only move within one block distance and
// where there aren't barriers.
// Also need to toggle (only can one element have the 'player-1' class a time)
//$('.grid-item').click.addClass("player-1");

// Event handlers
$('#start-btn').click(generateGame)
$('#reset-btn').click(reset)


/*
Pseudo Code para le movimiento:
1. iluminar los posibles movimientos
2. if (box !unavailable AND (distancia de this.x < 3 AND this.y estable) OR (distancia de this.y < 3 AND this.x estable))
4. Avanzar a donde se hizo el click
5. Evitar que pase sobre bloque
*/
function movePlayer1(){
  $('.grid-item').click(function(){
    // Make sure is within distance
    if ((Math.abs(this.dataset['x'] - player1.position.x) <= 3) && (this.dataset['y'] === player1.position.y)
        || (Math.abs(this.dataset['y'] - player1.position.y) <= 3) && (this.dataset['x'] === player1.position.x)) {
        const element = $(this);
        if (!element.hasClass("block") && !element.hasClass("player-2") && player1Turn){
          if (element.hasClass("weapon")){
            alert("Tengo arma!");
            element.removeClass("weapon");
          }
          playerReset("player-1");
          element.addClass("player-1");
          element.addClass("unavailable");
          playerEncounter(player1.position.x, player1.position.y, player2.position.x, player2.position.y);
          player1Turn = !player1Turn;
        }
      }
      getPlayerPosition();
  });
}

function movePlayer2(){
  $('.grid-item').click(function(){
    // Make sure is within distance
    if ((Math.abs(this.dataset['x'] - player2.position.x) <= 3) && (this.dataset['y'] === player2.position.y)
        || (Math.abs(this.dataset['y'] - player2.position.y) <= 3) && (this.dataset['x'] === player2.position.x)) {
        const element = $(this);
        if (!element.hasClass("block") && !element.hasClass("player-1") && !player1Turn){
          if (element.hasClass("weapon")){
            alert("Tengo arma!");
            element.removeClass("weapon");
          }
          playerReset("player-2");
          element.addClass("player-2");
          element.addClass("unavailable");
          //playerEncounter2(this.dataset['y'], this.dataset['x']);
          player1Turn = !player1Turn;
        }
    }
    getPlayerPosition();
  });
}
  


// What happens when players enounter each other
function playerEncounter(player1Y, player1X, player2X, player2Y){
  $('.grid-item').each(function(){
    const element = $(this);
    if (element.hasClass("player-2")) {
      console.log("player2xy",player2X,player2Y);
      if (player1Y === player2Y && (Math.abs(player1X - player2X) === 1)
          || player1X === player2X && (Math.abs(player1Y - player2Y) === 1)){
        alert("Hola Loco, time to fight");
      }
    }
  })
}

function playerEncounter2(player2Y, player2X){
  let player1X = 0;
  let player1Y = 0;
  $('.grid-item').each(function(){
    const element = $(this);
    if (element.hasClass("player-1")) {
      player1X = this.dataset['x'];
      player1Y = this.dataset['y'];
      console.log("player1xy",player1X,player1Y);
      if (player1Y === player2Y && (Math.abs(player1X - player2X) === 1)
          || player1X === player2X && (Math.abs(player1Y - player2Y) === 1)){
        alert("Hola Loco, time to fight");
      }
    }
  })
}