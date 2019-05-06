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
      damage: 60,
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
  currentWeapon: weapons[0],
  isDefending: false
}

const player2 = {
  position: {
    x: 0,
    y: 0
  },
  health: 200,
  hasWeapon: false,
  currentWeapon: weapons[0],
  isDefending: false
}



/*=================================== Build The Game ================================== */

// Generate random numbers
const generateRandomNum = () => Math.floor(Math.random() * 10);

// Generate grid with blocks
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    $('.grid-container').append('<div class="grid-item" data-y='+i+' data-x='+j+'></div>')
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
    console.log("intento de clase: ", className)
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
    element.removeClass("possible");
    element.removeClass("unavailable");
    fightMode = false;
    statReset();
    $( ".fightButton1" ).css( "display", "none" );
    $( ".fightButton2" ).css( "display", "none" );
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
displayStats(player1);
displayStats(player2);
}

// Event handlers
$('.close').click(generateGame)

/*=================================== Player Movements ================================== */
// Variable to check movements
let playerTurn = true; 

function pathHighlight() {
  if (!fightMode){
    if (playerTurn) {
      possiblePath(player1)
    } else {
      possiblePath(player2)
    }
  }
}

function movePlayer(player){
$('.grid-item').click(function(){
pathHighlight()
const element = $(this);
const block = this;
  // Make sure is within distance
  if (element.hasClass("possible")) {
      if (player === player2) {
        if (!playerTurn){
          weaponChecker(block, player)
          handleWeapon(element, player);
          playerReset("player-2");
          element.addClass("player-2");
          $( "#2-player-turn" ).css( "display", "none" );
          $( "#1-player-turn" ).css( "display", "block" );
          handleFight()
          playerTurn = !playerTurn;
          displayStats(player);
          }
      } 
      if (player === player1) {
        if (playerTurn){
          weaponChecker(block, player)
          handleWeapon(element, player);
          playerReset("player-1");
          element.addClass("player-1");
          $( "#1-player-turn" ).css( "display", "none" );
          $( "#2-player-turn" ).css( "display", "block" );
          handleFight()
          playerTurn = !playerTurn;
          displayStats(player);
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

/*=================================== Handle Weapons ================================== */
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

// Check if there are any weapons in the path
function weaponChecker(block, player){
  checkSmallerX (block, player)
  checkSmallerY (block, player)
  checkLargerX (block, player)
  checkLargerY (block, player)
}

// Check if there is a weapon left of the player
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

// Check if there is a weapon right of the player
function checkLargerX (block, player) {
  if (block.dataset['x'] > player.position.x){
    $('.possible').each(function(){
      const element = $(this);
      const innerBlock = this;
      if((innerBlock.dataset['x'] > player.position.x)
         && (innerBlock.dataset['y'] == player.position.y)
         && (innerBlock.dataset['x'] < block.dataset['x'])){
        if(element.hasClass("weapon")){
          weaponChange(element, player)
        }
      }
    })
  }
}

// Check if there is a weapon under the player
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

// Check if there is a weapon over the player
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

// If there is a weapon, handle it by removing the class and replacing it
// with the current one of the player
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

/*============================= Player Encounters  and fighting ============================= */
let fightMode = false;

function handleWeapon (element, player) {
  weaponChange(element, player)
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

  // Logic to take care of the turns
function handleFight(){
  if (playerEncounter()){
    fightMode = true;
    $( ".turn" ).css( "display", "none" );
    $( "#table" ).css( "display", "none" );
    $( "#fight" ).css( "display", "block" );
      if (playerTurn){
        $( ".fightButton1" ).css("display", "inline-block");
        $( ".fightButton2" ).css("display", "none");
      } 
      if (!playerTurn){
        $( ".fightButton2" ).css("display", "inline-block");
        $( ".fightButton1" ).css("display", "none");
      }
  }
}

// Logic to take care of the attacks
function attackFunc(){
  handleFight();
  if (!playerTurn){
    if (player2.isDefending){
      player2.health = player2.health  - (player1.currentWeapon.damage / 2);
      displayStats(player2);
    } else {
      player2.health = player2.health  - player1.currentWeapon.damage;
      displayStats(player2);
    }
  } else {
    if (player1.isDefending){
      player1.health = player1.health  - (player2.currentWeapon.damage / 2);
      displayStats(player1);
    } else {
      player1.health = player1.health  - player2.currentWeapon.damage;
      displayStats(player1);
    }
  }
  player1.isDefending = false;
  player2.isDefending = false;
  playerTurn = !playerTurn;
  isGameOver();
} 

// Defense
function defendFunc(){
  alert("defend");
  handleFight();
  if (!playerTurn){
    player1.isDefending = true;
    displayStats(player2);
  } else {
    player2.isDefending = true;
    // Show a shield or something
    displayStats(player1);
  }
  playerTurn = !playerTurn;
  isGameOver();
} 

// Check if player is out of health and call  the box modal if that is the case
function isGameOver(){
  if (player1.health <= 0){
      player1.health = 0;
      $( ".fightButton1" ).css( "display", "none" );
      $( ".fightButton2" ).css( "display", "none" );
      displayStats(player1);
      // timeout used so the health can be seen before the modal box
      setTimeout(
        function(){ 
          // inner html Player name
          document.getElementById("match-winner").innerHTML = "Loki, the god of mischief";
          document.getElementById("winner-img").src ="images/loki.png";
          endModal.style.display = "block" 
        }, 
          1000);
  }
  if (player2.health <= 0){
    player2.health = 0;
    $( ".fightButton1" ).css( "display", "none" );
    $( ".fightButton2" ).css( "display", "none" );
    displayStats(player2)
    setTimeout(
      function(){ 
        // inner html Player name
        document.getElementById("match-winner").innerHTML = "Thor, son of Odin";
        document.getElementById("winner-img").src = "images/Thor.png";
        endModal.style.display = "block" 
      }, 
        1000);
  }
}
/*=============================== Handle Sidebars Display ============================== */
// Display the stats at the sides
function displayStats(player) {
  const weapon = player.currentWeapon.name;
  const health = player.health;
  const damage = player.currentWeapon.damage;
  if (player === player1){
    document.getElementById("player1-weapon").innerHTML = weapon;
    document.getElementById("player1-health").innerHTML = health;
    document.getElementById("player1-damage").innerHTML = damage;
  } else {
    document.getElementById("player2-weapon").innerHTML = weapon;
    document.getElementById("player2-health").innerHTML = health;
    document.getElementById("player2-damage").innerHTML = damage;
  }
}

// reset all stats
function statReset(){
  document.getElementById("player1-weapon").innerHTML = "";
  document.getElementById("player1-health").innerHTML = "";
  document.getElementById("player1-damage").innerHTML = "";
  document.getElementById("player2-weapon").innerHTML = "";
  document.getElementById("player2-health").innerHTML = "";
  document.getElementById("player2-damage").innerHTML = "";
}

/*=========== MODAL STUFF ==============*/ 

/*----- Start Modal -----*/
// Get the modal
const startModal = document.getElementById('start-modal');
// Get the element to close the modal
const startBtn = document.getElementsByClassName("close")[0];
// When the user clicks to start game
startBtn.onclick = function() {
  startModal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == startModal) {
    startModal.style.display = "none";
  }
}
/*----- End Modal -----*/
const endModal = document.getElementById('end-modal');
const rematchBtn = document.getElementsByClassName("rematch")[0];
rematchBtn.onclick = function() {
  document.location.reload()
}
// When the user clicks anywhere outside of the modal, close it
window.onload(
  startModal.style.display = "block",
  endModal.style.display = "none",
  $( ".fightButton1" ).css( "display", "none" ),
  $( ".fightButton2" ).css( "display", "none" ),
  $( "#fight" ).css( "display", "none" ),
  $( "#2-player-turn" ).css( "display", "none" )
  )
