const player1 = {
  name: 'name1',
  position: {
    x: 0,
    y:0
  },
  healthscore: 100,
  weapon: 'lilly'
}
const player2 = {
  name: 'name1',
  position: {
    x: 0,
    y:0
  },
  healthscore: 100,
  weapon: 'lilly'
}
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
    element.removeClass("player1");
    element.removeClass("player2");
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
  //console.log("$(this), this",$(this), this);
  //$(`[data-row= "${currentRow}"][data-column="${currentColumn - i}"]`)
  let selectedSquare = $(`[data-x= "${random_x}"][data-y="${random_y}"]`)
  console.log('selectedSquare', selectedSquare);

  if (selectedSquare) {
    if ( !selectedSquare.hasClass('unavailable') ){
      console.log("available");
      $(`[data-x= "${random_x}"][data-y="${random_y}"]`).addClass(className);
    $(`[data-x= "${random_x}"][data-y="${random_y}"]`).addClass("unavailable");
    } else {
      console.log("unavailable");
      // Function calls itself recursively until it finds available space
      placeElements(className);
    }

  }

    if(className === 'player1') {
      player1.position.x = random_x;
      player1.position.y = random_y;
      console.log('player1', player1.position);
    } else {
      player2.position.x = random_x;
      player2.position.y = random_y;
      console.log('player2', player2.position);
    }

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
    placeElements("player1");
  },1)
  generate(function(){
    placeElements("player2");
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
// Also need to toggle (only can one element have the 'player1' class a time)
//$('.grid-item').click.addClass("player1");

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
      if (element.hasClass("player1")) {
        player1X = this.dataset['x'];
        player1Y = this.dataset['y'];
      }
    })
    // Make sure is within distance
    if ((Math.abs(this.dataset['x'] - player1X) <= 3) && (this.dataset['y'] === player1Y)
        || (Math.abs(this.dataset['y'] - player1Y) <= 3) && (this.dataset['x'] === player1X)) {
        const element = $(this);
        if (!element.hasClass("block") && !element.hasClass("player2") && player1Turn){
          if (element.hasClass("weapon")){
            alert("Tengo arma!");
            element.removeClass("weapon");
          }
          playerReset("player1");
          element.addClass("player1");
          element.addClass("unavailable");
          console.log("pla1XY",player1X,player1Y)
          playerEncounter(this.dataset['y'], this.dataset['x']);
          player1Turn = !player1Turn;
        }
    }
  });
}

function isSquareAvailable(square) {
  console.log('square', square);
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
    let $element = $(this);
    let element = this;

    $('.grid-item').each(function(){

      if ($(this).hasClass("player2")) {
        player2X = this.dataset['x'];
        player2Y = this.dataset['y'];
      }

    })
    // Make sure is within distance


        console.log(isSquareAvailable(this));
        const isSquareAvailable = isSquareAvailable(element);
        if (isSquareAvailable && !$element.hasClass("block") && !$element.hasClass("player1") && !player1Turn){
          if ($element.hasClass("weapon")){
            alert("Tengo arma!");
            $element.removeClass("weapon");
          }
          playerReset("player2");
          $element.addClass("player2");
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
    if (element.hasClass("player2")) {
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
    if (element.hasClass("player1")) {
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


// Hi, so for next week, before moving ahead with the player movement functionality, please create two player objects like the ones I put in, and also an array of weapon objects. The player objects need to know where they are located (so, they need a position object as a parameter).  The weapons need to have names and powers associated with them.

// The reason you need these objects are to store information about them. It’s time consuming and cumbersome to store and get all your data in the HTML structure. We stored knowledge of the location of an HTML square in the square itself, since this is data that belongs to the square.  We will then store information belonging to the players and the weapons in their respective objects.

// Once you put those objects into place, it will be a lot easier to move around the board and do other things. 
// Once the players are placed, you need to update their location in their objects. Each time they move, their position will be updated. That is how you will knwo where they are (as opposed to searching through each square to find the square with the class of the player).
// Hope this makes sense!