/*=================================== Player Objects ================================== */

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
/*=================================== Build The Game ================================== */

// Generate random numbers
const generateRandomNum = () => Math.floor(Math.random() * 10);

// Generate grid with blocks
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    $('.grid-container').append('<div class="grid-item" data-y='+i+' data-x='+j+'>Block at x='+j+' y='+i+'</div>')
  }
}
// Iterates different elements to display them on the board
function generate(func, times){
  for (let i = 0; i < Number(times); i++) {
    func();
  }
}
// This functions helps blocks, weapons and players find an available aquare in the board
function placeElements(className) {
  const random_x = generateRandomNum();
  const random_y = generateRandomNum();
  $('.grid-item').each(function(){
    const element = $(this);
    if (this.dataset['x'] == random_x && this.dataset['y'] == random_y) {
      if (!(this.classList.contains("unavailable"))){
        element.addClass(className);
        element.addClass("unavailable");
        // updates the position values to the player objects
        if (className === "player-1") {
          player1.position.x = this.dataset['x'];
          player1.position.y = this.dataset['y'];
        } else if (className === "player-2"){
          player2.position.x = this.dataset['x'];
          player2.position.y = this.dataset['y'];
        }
        if(playerEncounter()){
          console.log("Early Encounter")
          playerReset(className)
          placeElements(className);
        }
      } else {
        // Function calls itself recursively until it finds available space
        placeElements(className);
      }
    }
  })
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

// Event handlers
$('#start-btn').click(generateGame)
$('#reset-btn').click(reset)

/*=================================== Player Movements ================================== */
// Variable to check movements
let playerTurn = true; 

function pathHighlight() {
  if (playerTurn) {
    possiblePath(player1)
  } else {
    possiblePath(player2)
  }
}

function movePlayer(player){
$('.grid-item').click(function(){
pathHighlight()
const element = $(this);
  // Make sure is within distance
  if (element.hasClass("possible")) {
      if (player === player2) {
        if (!playerTurn){
          handleWeapon(element, player);
          playerReset("player-2");
          element.addClass("player-2");
          handleFight()
          playerTurn = !playerTurn;
          }
      } 
      if (player === player1) {
        if (playerTurn){
          handleWeapon(element, player);
          playerReset("player-1");
          element.addClass("player-1");
          handleFight()
          playerTurn = !playerTurn;
        }
      }
  }
  pathHighlight()
});
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

function squareOccupied (element) {
  return (
    element.hasClass("block") || 
    element.hasClass("player-1") || 
    element.hasClass("player-2")
    )
}

function possiblePath(player) {
  $('.grid-item').each(function(){
    const element = $(this);
    const block = this;
    if (isInDistance(player, block)
        && !squareOccupied(element)
        ){
      element.addClass("possible");
    }
  })
  $('.grid-item').each(function(){
    const element = $(this);
    const block = this;
    // value larger with larger X
    if(isInDistance(player, block) && (block.dataset['x'] > player.position.x)){
      if(squareOccupied(element)){
        occupiedObject = this;
        $('.possible').each(function(){
          const element = $(this);
          const block = this;
          if (block.dataset['x'] > occupiedObject .dataset['x']){
            element.removeClass("possible")
          }
        })
      }
    }
    // value with lower X
    if(isInDistance(player, block) && (block.dataset['x'] < player.position.x)){
      if(squareOccupied(element)){
        occupiedObject  = this;
        $('.possible').each(function(){
          const element = $(this);
          const block = this;
          if (block.dataset['x'] < occupiedObject .dataset['x']){
            element.removeClass("possible")
          }
        })
      }
    }
    // value with higher y
    if(isInDistance(player, block) && (block.dataset['y'] > player.position.y)){
      if(squareOccupied(element)){
        occupiedObject  = this;
        $('.possible').each(function(){
          const element = $(this);
          const block = this;
          if (block.dataset['y'] > occupiedObject .dataset['y']){
            element.removeClass("possible")
          }
        })
      }
    }
    // value with lower y
    if(isInDistance(player, block) && (block.dataset['y'] < player.position.y)){
      if(squareOccupied(element)){
        occupiedObject  = this;
        $('.possible').each(function(){
          const element = $(this);
          const block = this;
          if (block.dataset['y'] < occupiedObject .dataset['y']){
            element.removeClass("possible")
          }
        })
      }
    }
  })
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

/*=================================== Player Encounters ================================== */

function handleWeapon (element, player) {
  if (element.hasClass("weapon")){
    alert("weapon!");
    element.removeClass("weapon");
    player.hasWeapon = true;
  }
}
  
// What happens when players encounter each other
function playerEncounter(){
  getPlayerPosition()
  const xPosition = Math.abs(Number(player1.position.x) - Number(player2.position.x));
  const yPosition = Math.abs(Number(player2.position.y) - Number(player1.position.y));
  return (((xPosition == 0) && ( yPosition == 1))
          ||
          ((yPosition == 0) && (xPosition == 1))
  )}

function handleFight(){
  if (playerEncounter()){
    alert("Time to fight!")
  }
}
 