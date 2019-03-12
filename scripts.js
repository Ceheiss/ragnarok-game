// Generate grid with blocks
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    $('.grid-container').append('<div class="grid-item" data-x='+i+' data-y='+j+'>Block at x='+i+' y='+j+'</div>')
  }
}

// Generate random numbers
const generateRandomNum = () => Math.floor(Math.random() * 10);

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

// This functions helps blocks, weapons and players find an available aquare in the board
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
  },4)
  generate(function(){
    selectElements("weapon");
  },4)
  generate(function(){
    selectElements("player-1");
  },1)
  generate(function(){
    selectElements("player-2");
  },1)
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


