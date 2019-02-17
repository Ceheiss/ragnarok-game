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