$(document).ready(() => {

  $("form").submit(function (e) {
    e.preventDefault();
  });

  $(function () {
    $(window).keypress(function (e) {
      if (e.which == 109) {
        toggleItems();
        toggleCrops();
      }
    });
  });


});

var growingBlocks = []
var notificationTimeout = -1;
var blocks = [];
var grid = []
var farmId = 0;
var inMenu = false;
var selectedCrop = 0;
var selectedItem = 0;
var loaded = false;
var settings;
var level = 0;

var itemInventory, cropInventory;


// Calculate the dimensions of the main element so the farm fits
function calcDimensions() {

  // 25 x 20
  // Calculate the size of a block on the width and heigth
  screenGrid.blockWidth = Math.floor($('main').width() / 25) - 2;
  screenGrid.blockHeight = Math.floor($('main').height() / 20) - 2;
  // Initialize all the elements for the farm
  spawnFarm(25, 20) // columns and rows
  spawnItems();
  spawnCrops();

}

function spawnFarm(columns, rows) {

  // Set the global variables in screengrid
  screenGrid.columns = columns;
  screenGrid.rows = rows;

  // Initialize createdBlocks which will later be appended
  var createdBlocks = "";

  // Create a row for every row haha
  for (let r = 0; r < rows; r++) {
    // Create a column for every column
    for (let c = 0; c < columns; c++) {

      // Apply properties
      const block = `<div onmouseover="selectBlockMouse(this.id)" onclick="blockInteraction()" style="width: ${screenGrid.blockWidth}px; height: ${screenGrid.blockHeight}px; border: 1px solid darkgreen; font-size: 0px; background-color: ${getColor(r, c)}" id="${r}-${c}" class="block">${getCrop(r, c)}</div>`;
      createdBlocks += block;
      // Check if its growing
      if (grid[r][c].startedGrowing != 0) {
        // Push it to the array so the interval will check the growing state
        growingBlocks.push({ 'r': r, 'c': c })
      }
    }
  }
  // Append to the HTMl and set the block's line height
  $('.farm-field').append(createdBlocks);
  $(`.block`).css('lineHeight', screenGrid.blockHeight + 'px');
  // Select the first block in the grid
  $('#0-0').addClass('selected-block')

  // Start the interval to check the farm crops statusses
  checkGrowings();

}

// This function is used to get the color from a prefabBlock.
function getColor(r, c) {
  for (var key in blocksPrefabs) {
    if (key == grid[r][c].name) {
      return blocksPrefabs[key].color;
    }
  }
}

// This checks if theres a crop on the block
function getCrop(r, c) {
  if (grid[r][c].crop != -1) {
    if (grid[r][c].ready) {
      return crops[grid[r][c].crop].icon;
    } else {
      return crops[grid[r][c].crop].prematureIcon;
    }
  } else {
    return "";
  }
}

// Any interaction with a block goes through this function
function blockInteraction(id) {
  if (selectedItem) {
    selectedItem.use()
  } else {
    showNotification(2500, "Please select an item from your inventory")
  }
}

// This is to cut a crop once its finished, (Currently unused)
function harvestCrop() {
  if (grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop != -1) {
    // grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop = 0;
    // grid[screenGrid.selectedRow][screenGrid.selectedColumn].name = blocksPrefabs.dirt.name;
    // $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).text('');
    socket.emit('harvestCrop', settings.id, screenGrid.selectedRow, screenGrid.selectedColumn)
  }
}

// When a crop is selected this is used to plant a crop on an item
function plantCrop() {

  // Check if there is no crop and check if the block has been prepared (with a hoe)
  if (grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop == -1 && grid[screenGrid.selectedRow][screenGrid.selectedColumn].prepared) {
    // Emit an event to the Node.JS server to ask if we can place the crop
    console.log('sending')
    socket.emit('plantCrop', settings.id, screenGrid.selectedRow, screenGrid.selectedColumn, cropInventory[hudCrops.selectedRow].name)
  } else {
    showNotification(3000, "Prepare the land before trying to plant seeds", true)
  }
}

// This is called when you have  a hoe selected and want to prepare the land for a crop
function prepareBlock() {

  // Check if the land has not been prepared yet
  if (!grid[screenGrid.selectedRow][screenGrid.selectedColumn].prepared) {
    // Tell the server we would like to update the block to be prepared
    socket.emit('updateBlock', settings.id, screenGrid.selectedRow, screenGrid.selectedColumn, 'dirt')
  }

}

// Unused function to update money in the UI
function updateMoney(moneyToAdd) {
  money += moneyToAdd;
  $('#farm-money').text(money + "$");
}



// Functions to play a sound
function moveSound(sound) {
  var s = new Audio(`sounds/${sound}.ogg`);
  s.loop = false;
  s.play();
}

function playSound(sound) {
  var s = new Audio(`sounds/${sound}.ogg`);
  s.loop = false;
  s.play();
}

// Interval to check progress on stuff that is growing
function checkGrowings() {
  setInterval(() => {
    // check every growingblock
    for (let i = 0; i < growingBlocks.length; i++) {
      let r = growingBlocks[i].r;
      let c = growingBlocks[i].c;
      const block = grid[r][c];
      // If the growing has finished remove it from the array
      if (Date.now() - block.startedGrowing > (block.growTime * 1000)) {
        growingBlocks.splice(i, 1);
        // Set the crop image to the grown one
        updateCropImage(r, c, true);
      } else {
        // Set the crop image to the growing one
        updateCropImage(r, c, false, block.growTime);
      }

    }
  }, 500);

}

function updateCropImage(r, c, status, growTime = 0) {
  // Set the status of the growing crop
  grid[r][c].ready = status;
  if (status) {
    // Set it to the grown item and set the font size accuratly
    $(`#${r}-${c}`).text(cropInventory[grid[r][c].crop].icon);
    $(`#${r}-${c}`).css('fontSize', (screenGrid.blockHeight - 10));
  } else {
    // Update the font size every interval so it looks like its growing
    $(`#${r}-${c}`).text(cropInventory[grid[r][c].crop].prematureIcon);
    let fontSize = parseFloat($(`#${r}-${c}`).css('fontSize')) + ((screenGrid.blockHeight - 10) / growTime / 2);
    console.log("Inceremnt size: " + (screenGrid.blockHeight - 10) / growTime)
    $(`#${r}-${c}`).css('fontSize', fontSize + 'px');
  }
}

function calculateLevel() {

  var currentExp = settings.exp;

  // For every level you need to earn 1.15x more exp.
  // A level increase once currentExp surpasses the needed amount of exp
  // Level 0 to 1 requires 1000exp

  // base level 0 exp
  var expCount = 1000;
  // For in the loop
  var prevLevelExp = 0;
  const multiplier = 1.21;
  // 100 levels
  for (let le = 1; le <= 100; le++) {
    expCount *= multiplier;
    // Check if current exp is in between values
    if (currentExp > prevLevelExp && currentExp < expCount) {

      // Check for a level up
      if (le > level) {
        levelUp();
      }
      // Append to game
      $('#current-lvl').text(`${le}`)
      $('#next-lvl').text(`${le + 1}`)
      $('#exp-value').val(currentExp - prevLevelExp);
      $('#exp-value').prop('max', expCount - prevLevelExp);
      $('#exp-text').text(`${Math.round(expCount - currentExp)} EXP TO NEXT LEVEL`);
      level = le;
      return;
    }
    prevLevelExp = expCount;
  }

}

function levelUp() {
  playSound('levelup')
}




// When a farmer joins the current farm (room)
socket.on('farmerJoined', (socketid) => {
  console.log(`Another farmer joined: ${socketid}`)
  // Check if its the client him/her self
  if (socketid == socket.id) {
    setTimeout(() => {
      showNotification(3000, 'Welcome to the farm', true)
    }, 1000);
  } else {
    showNotification(3000, 'Another farmer joined', true)
  }

})

socket.on('updateExp', (newExp) => {
  console.log(newExp)
  settings.exp = newExp;
  calculateLevel();
})

// If the server has prepared the block, this will receive the update and will then update the grid variable
socket.on('singleBlockUpdate', (row, column) => {
  console.log(`Block updated ${row}x${column}`)
  grid[row][column].crop = -1;
  grid[row][column].ready = false;
  grid[row][column].prepared = true;
  grid[row][column].name = blocksPrefabs.dirt.name;
  // apply the color
  $(`#${row}-${column}`).css('backgroundColor', blocksPrefabs.dirt.color);
  $(`#${row}-${column}`).text("");
  // It also plays a sound haha
  playSound('hoe');
})

// When the server has allowed the crop placement
socket.on('singleCropBlockUpdate', (row, column, cropName, growTime, startedGrowing) => {
  console.log(`Block updated ${row}x${column}`)
  for (let c = 0; c < cropInventory.length; c++) {
    if (cropInventory[c].name == cropName) {
      grid[row][column].crop = c;
      grid[row][column].startedGrowing = startedGrowing;
      grid[row][column].growTime = growTime;
      // Push the crop to the growingBlocks so it is checked by the interval so it will visually grow
      growingBlocks.push({ r: row, c: column })
      // Set the text to the proper crop emoji
      $(`#${row}-${column}`).text(getCrop(row, column));
    }
    
  }

})

socket.on('updateMoney', (money) => {
  updateMoney(money);
})