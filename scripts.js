// players
const player1 = {
  position: {
    x: 0,
    y: 0
  },
  hasWeapon: false
}

const player2 = {
  position: {
    x: 0,
    y: 0
  },
  hasWeapon: false
}

// Generate random numbers
let playerTurn = true; // pass this as an object property
const generateRandomNum = () => Math.floor(Math.random() * 10);


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
      //console.log("player1 X position is: ", player1.position.x)
      player1.position.y = this.dataset['y'];
      //console.log("player1 Y position is: ", player1.position.y)
    }
    if (element.hasClass("player-2")) {
      player2.position.x = this.dataset['x'];
      player2.position.y = this.dataset['y'];
    }
  })
}

// Clean all the board
function reset() {
  $('.grid-item').each(function(){
    const element = $(this);
    element.removeClass("block");
    element.removeClass("weapon");
    element.removeClass("player-1");
    element.removeClass("player-2");
    element.removeClass("unavailable");
    element.removeClass("possible");
  })
}

function playerReset(player) {
  $('.grid-item').each(function(){
    const element = $(this);
    element.removeClass(player);
    element.removeClass("possible");
  })
}

function squareNotOccupied (element) {
  return (
        !element.hasClass("block")
        && !element.hasClass("player-1")
        && !element.hasClass("player-2")
  )
}

function possiblePath(player) {
  $('.grid-item').each(function(){
    const element = $(this);
    if (isInDistance(player, this)
        && squareNotOccupied(element)
        ){
      element.addClass("possible");
    }
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
        //console.log("available");
        element.addClass(className);
        element.addClass("unavailable");
        if (className === "player-1") {
          player1.position.x = this.dataset['x'];
          player1.position.y = this.dataset['y'];
        } else if (className === "player-2"){
          player2.position.x = this.dataset['x'];
          player2.position.y = this.dataset['y'];
        }
      } else if (playerEncounter()) {
          placeElements(className);
          console.log("oops, early encounter")
      } else {
        //console.log("unavailable");
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
  movePlayer(player1);
  movePlayer(player2);
  pathHighlight();
}

// Blocks console.log their location
$('.grid-item').click(function(){
  console.log(`Coordenada X es ${this.dataset['x']}\nCoordenada Y es ${this.dataset['y']}`);
})

function pathHighlight() {
    if (playerTurn) {
      possiblePath(player1)
    } else {
      possiblePath(player2)
    }
}
// To move character, put conditionals to only move within one block distance and
// where there aren't barriers.
// Also need to toggle (only can one element have the 'player-1' class a time)
//$('.grid-item').click.addClass("player-1");

// Event handlers
$('#start-btn').click(generateGame)
$('#reset-btn').click(reset)


function movePlayer(player){
  $('.grid-item').click(function(){
  pathHighlight()
    // Make sure is within distance
    if (isInDistance(player, this)) {
        const element = $(this);
        if (player === player2 && squareNotOccupied(element)) {
          if (!playerTurn){
            if (element.hasClass("weapon")){
              alert("weapon!");
              element.removeClass("weapon");
              player.hasWeapon = true;
            }
            playerReset("player-2");
            element.addClass("player-2");
            element.addClass("unavailable");
            playerEncounter()
            playerTurn = !playerTurn;
            }
        } 
        if (player === player1 && squareNotOccupied(element)) {
          if (playerTurn){
          if (element.hasClass("weapon")){
            alert("weapon!");
            element.removeClass("weapon");
            player.hasWeapon = true;
          }
          playerReset("player-1");
          element.addClass("player-1");
          element.addClass("unavailable");
          playerEncounter();
          playerTurn = !playerTurn;
          }
        }
    }
    pathHighlight()
  });
}

// I need to reference all the elements that are "inDistance"
// To determine if they have block or player class, if they do
// movement is not possible
function isInDistance (player, block) {
  const firstCondition = (Math.abs(block.dataset['x'] - player.position.x) <= 3)
  && (block.dataset['y'] === player.position.y)

  const secondCondition = (Math.abs(block.dataset['y'] - player.position.y) <= 3) 
  && (block.dataset['x'] === player.position.x)

  return (firstCondition || secondCondition)
}
  
// What happens when players encounter each other
function playerEncounter(){
  getPlayerPosition()
  //console.log("X",(Math.abs(player1.position.x - player2.position.x)));
  //console.log("Y",(Math.abs(player1.position.y - player2.position.y)));
  return ((Math.abs(player1.position.x - player2.position.x)) === 0 
      && (Math.abs(player2.position.y - player1.position.y) === 1) 
      ||
      player1.position.y === player2.position.y 
      && (Math.abs(player1.position.x - player2.position.x) === 1))   
}

