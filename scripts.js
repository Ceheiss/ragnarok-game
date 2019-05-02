/*=================================== Player Objects ================================== */
// weapons
const weapons = 
 [
    {
      name: "Banana Blaster",
      damage: 40,
      className: "weapon-1"
    },
    {
      name: "Lemon Pie",
      damage: 50,
      className: "weapon-2"
    },
    {
      name: "Rubber Duck",
      damage: 50,
      className: "weapon-3"
    },
    {
      name: "Goblin",
      damage: 70,
      className: "weapon-4"
    },
  ]

// players
const player1 = {
  position: {
    x: 0,
    y: 0
  },
  health: 200,
  hasWeapon: false,
  currentWeapon: weapons[0]
}

const player2 = {
  position: {
    x: 0,
    y: 0
  },
  health: 200,
  hasWeapon: false,
  currentWeapon: weapons[0]
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
        } else if (className === "weapon-1" ||
                   className === "weapon-2"||
                   className === "weapon-3"||
                   className === "weapon-4"){
          element.addClass("weapon");
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
  placeElements("weapon-2");
},1)
generate(function(){
  placeElements("weapon-3");
},1)
generate(function(){
  placeElements("weapon-4");
},1)
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
const block = this;
  // Make sure is within distance
  if (element.hasClass("possible")) {
      weaponChecker(block, player)
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
    element.removeClass("weapon-1");
    element.removeClass("weapon-2");
    element.removeClass("weapon-3");
    element.removeClass("weapon-4");
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
          if (block.dataset['x'] > occupiedObject.dataset['x']){
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
          if (block.dataset['x'] < occupiedObject.dataset['x']){
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
          if (block.dataset['y'] > occupiedObject.dataset['y']){
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
          if (block.dataset['y'] < occupiedObject.dataset['y']){
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
  if (element.hasClass("weapon-1")){
    alert("weapon 1, the oyster seasoner!");
    element.removeClass("weapon");
    element.removeClass("weapon-1");
    // remove current player weapon
    // add current player weapon to the element
    player.hasWeapon = true;
  } else if (element.hasClass("weapon-2")){
    alert("weapon 2, the banana blaster!");
    element.removeClass("weapon");
    element.removeClass("weapon-2");
    player.hasWeapon = true;
  } else if (element.hasClass("weapon-3")){
    alert("weapon 3, the angry shoelace!");
    element.removeClass("weapon");
    element.removeClass("weapon-3");
    player.hasWeapon = true;
  } else  if (element.hasClass("weapon-4")){
    alert("weapon 4, the fierce maccaroni!");
    element.removeClass("weapon");
    element.removeClass("weapon-4");
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
 
function weaponChecker(block, player){
  checkSmallerX (block, player)
  checkSmallerY (block, player)
  checkLargerX (block, player)
  checkLargerY (block, player)
}

function checkSmallerX (block, player){
  if (block.dataset['x'] < player.position.x){
    $('.possible').each(function(){
      const element = $(this);
      const innerBlock = this;
      if((innerBlock.dataset['x'] < player.position.x)
         && (innerBlock.dataset['y'] == player.position.y)
         && innerBlock.dataset['x'] > block.dataset['x']){
        if(element.hasClass("weapon")){
          weaponChange(element, player)
        }
      }
    })
  }
}

function checkLargerX (block, player) {
  if (block.dataset['x'] > player.position.x){
    $('.possible').each(function(){
      const element = $(this);
      const innerBlock = this;
      if((innerBlock.dataset['x'] > player.position.x)
         && (innerBlock.dataset['y'] == player.position.y)
         && innerBlock.dataset['x'] < block.dataset['x']){
        if(element.hasClass("weapon")){
          weaponChange(element, player)
        }
      }
    })
  }
}

function checkSmallerY (block, player) {
  if (block.dataset['y'] < player.position.y){
    $('.possible').each(function(){
      const element = $(this);
      const innerBlock = this;
      if((innerBlock.dataset['y'] < player.position.y)
         && (innerBlock.dataset['x'] == player.position.x)
         && innerBlock.dataset['y'] > block.dataset['y']){
        if(element.hasClass("weapon")){
          weaponChange(element, player)
        }
      }
    })
  }
}

function checkLargerY (block, player) {
  if (block.dataset['y'] > player.position.y){
    $('.possible').each(function(){
      const element = $(this);
      const innerBlock = this;
      if((innerBlock.dataset['y'] > player.position.y)
         && (innerBlock.dataset['x'] == player.position.x)
         && innerBlock.dataset['y'] < block.dataset['y']){
        if(element.hasClass("weapon")){
          weaponChange(element, player)
        }
      }
    })
  }
}

function weaponChange(element, player){
  let playerWeapon = player.currentWeapon
  if(element.hasClass("weapon-1")){
    element.removeClass("weapon-1")
    element.addClass(playerWeapon.className)
    player.currentWeapon = weapons[0]
    alert(" ahora tiene weapon-1")
  } else if(element.hasClass("weapon-2")){
    element.removeClass("weapon-2")
    element.addClass(playerWeapon.className)
    player.currentWeapon = weapons[1]
    alert(" ahora tiene weapon-2")
  } else if(element.hasClass("weapon-3")){
    element.removeClass("weapon-3")
    element.addClass(playerWeapon.className)
    player.currentWeapon = weapons[2]
    alert(" ahora tiene weapon-3")
  } else if(element.hasClass("weapon-4")){
    element.removeClass("weapon-4")
    element.addClass(playerWeapon.className)
    player.currentWeapon = weapons[3]
    alert(" ahora tiene weapon-4")
  }
}