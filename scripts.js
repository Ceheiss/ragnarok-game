// Generate grid with blocks
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    $('.grid-container').append('<div class="grid-item" data-y='+i+' data-x='+j+'>Block at x='+j+' y='+i+'</div>')
  }
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
function selectElements(className) {
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
      } else {
        console.log("unavailable");
        // Function calls itself recursively until it finds available space
        selectElements(className);
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
    selectElements("block");
  },12)
  generate(function(){
    selectElements("weapon");
  },4)
  generate(function(){
    selectElements("player-1");
  },1)
  generate(function(){
    selectElements("player-2");
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
    let player1X = 0;
    let player1Y = 0;
    $('.grid-item').each(function(){
      const element = $(this);
      // I take the coordinates of the player
      if (element.hasClass("player-1")) {
        player1X = this.dataset['x'];
        player1Y = this.dataset['y'];
      }
    })
    // Make sure is within distance
    if ((Math.abs(this.dataset['x'] - player1X) <= 3) && (this.dataset['y'] === player1Y)
        || (Math.abs(this.dataset['y'] - player1Y) <= 3) && (this.dataset['x'] === player1X)) {
        const element = $(this);
        if (!element.hasClass("block") && !element.hasClass("player-2") && player1Turn){
          if (element.hasClass("weapon")){
            alert("Tengo arma!");
            element.removeClass("weapon");
          }
          playerReset("player-1");
          element.addClass("player-1");
          element.addClass("unavailable");
          console.log("pla1XY",player1X,player1Y)
          playerEncounter(this.dataset['y'], this.dataset['x']);
          player1Turn = !player1Turn;
        }
    }
  });
}

function isSquareAvailable(square) {
  const firstCondition = (Math.abs(square.dataset['x'] - player2X) <= 3) && (square.dataset['y'] === player2Y);
  const secondCondition = (Math.abs(square.dataset['y'] - player2Y) <= 3) && (square.dataset['x'] === player2X);
  if (firstCondition || secondCondition) {
    return true;
  } else {
    return false;
  }
}

function movePlayer2(){
  $('.grid-item').click(function(){
    let player2X = 0;
    let player2Y = 0;
    $('.grid-item').each(function(){
      if ($(this).hasClass("player-2")) {
        player2X = this.dataset['x'];
        player2Y = this.dataset['y'];
      }
    })
    // Make sure is within distance
        const $element = $(this);
        const element = this;
        console.log(isSquareAvailable(this));
        const isSquareAvailable = isSquareAvailable(element);
        if (isSquareAvailable && !$element.hasClass("block") && !$element.hasClass("player-1") && !player1Turn){
          if ($element.hasClass("weapon")){
            alert("Tengo arma!");
            $element.removeClass("weapon");
          }
          playerReset("player-2");
          $element.addClass("player-2");
          $element.addClass("unavailable");
          console.log("pla2XY",player2X,player2Y)
          playerEncounter2(this.dataset['y'], this.dataset['x']);
          player1Turn = !player1Turn;
        }
  });
}




// What happens when players enounter each other
function playerEncounter(player1Y, player1X,){
  let player2X = 0;
  let player2Y = 0;
  $('.grid-item').each(function(){
    const element = $(this);
    if (element.hasClass("player-2")) {
      player2X = this.dataset['x'];
      player2Y = this.dataset['y'];
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