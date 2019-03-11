const generateRandomNum = () => Math.floor(Math.random() * 10);

console.log("Working JS")
// Step One
/*
Create the grid
Place barriers into the grid
Place weapons into the grid
Place players
*/

// Generate grid with blocks
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    $('.grid-container').append('<div class="grid-item" data-x='+i+' data-y='+j+'>Block at x='+i+' y='+j+'</div>')
  }
}

// Clean all the board
function reset() {
  $('.grid-item').each(function(){
    const element = $(this);
    element.removeClass("block");
    element.removeClass("weapon");
    element.removeClass("player-1");
    element.removeClass("player-2");
  })
}

function selectElements(className) {
  const random_x = generateRandomNum();
  const random_y = generateRandomNum();
  $('.grid-item').each(function(){
    const element = $(this);
    //console.log("$(this), this",$(this), this);
    if (this.dataset['x'] == random_x && this.dataset['y'] == random_y) {
      console.log("sabpee")
      if (!(this.classList.contains("unavailable"))){
        console.log("available");
        element.addClass(className);
        element.addClass("unavailable");
      } else {
        console.log("unavailable");
        selectElements(className);
      }
    }
  })
}

function generate(func, times){
  // It also kills previous things in the board
    for (let i = 0; i < Number(times); i++) {
      func();
    }
}

function setPlayers(className) {
  let random_x = generateRandomNum();
  let random_y = generateRandomNum();
  $('.grid-item').each(function(){
    let element = $(this);
    if (this.dataset['x'] == random_x && this.dataset['y'] == random_y) {
      console.log("sabpee")
      if (!(this.classList.contains("unavailable"))){
        console.log("available");
        element.addClass(className);
        element.addClass("unavailable");
      } else {
        console.log("unavailable");
        setPlayers(className);
      }
    }
  })
}


function generateGame(){
  reset();
  generate(function(){
    selectElements("block");
  },4)
  generate(function(){
    selectElements("weapon");
  },4)
  setPlayers("player-1");
  setPlayers("player-2");
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


