console.log("Working JS")

// Step One
/*
Create the grid
Place barriers into the grid
Place weapons into the grid
Place players
*/


for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    $('.grid-container').append('<div class="grid-item" data-x='+i+' data-y='+j+'>Block at x='+i+' y='+j+'</div>')
  }
}

$('#start-btn').click(generateBlocks)

$('#reset-btn').click(resetBlocks)

function resetBlocks() {
  $('.grid-item').each(function(){
    let element = $(this);
    element.removeClass("block");
    element.removeClass("player-1");
  })
}

function generateBlocks(){
  // once pressed, disable it until reset button is pressed
  $('.grid-item').each(function(){
    let element = $(this);
    element.removeClass("block");
    element.removeClass("player-1");
    // this confusing af
    for (let i = 0; i < 3; i++) {
      let random_x = Math.floor(Math.random() * 10);
      let random_y = Math.floor(Math.random() * 10);
      console.log("X is: " + random_x, "Y is: " + random_y);
      if (this.dataset['x'] == random_x && this.dataset['y'] == random_y) {
        element.addClass("block");
      }
    }
  })
}



// Tell where we are
$('.grid-item').click(function(){
  let element = $(this);
  console.log(`Coordenada X es ${this.dataset['x']}\nCoordenada Y es ${this.dataset['y']}`);
  element.addClass("player-1")
})

// Use random numbers to add class .block to grid-item in coordinates 
// data-x=random and data-y=random


//$('.grid-item').click.addClass("player-1");


$('#element').click(function(){
    alert("ejale!")
})




