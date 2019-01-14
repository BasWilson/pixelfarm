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

const socket = io('http://188.166.122.43:4444');
var growingBlocks = []
var notificationTimeout = -1;
var money = 100;
var blocks = [];
var grid = []
var farmId = 0;
var inMenu = false;
var selectedCrop = 0;
var selectedItem = 0;
var loaded = false;

const blocksPrefabs = {
  'grass': {
    'color': '#58B940',
    'name': 'grass'
  },
  'dirt': {
    'color': '#3F2909',
    'name': 'dirt'
  },
}

// Tools/items that can be used in the game
const items = [
  {
    'name': 'hoe',
    'use': prepareBlock,
  },
  {
    'name': 'scissors',
    'use': cutItem
  }
]

// All available crops
const crops = [
  {
    'name': 'corn',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🌽',
    'growTime': 30
  },
  {
    'name': 'grape',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🍇',
    'growTime': 40
  },
  {
    'name': 'watermelon',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🍉',
    'growTime': 45
  },
  {
    'name': 'carrot',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🥕',
    'growTime': 20
  },
  {
    'name': 'cucumber',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🥒',
    'growTime': 25
  },
  {
    'name': 'eggplant',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🍆',
    'growTime': 25
  },
  {
    'name': 'potato',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🥔',
    'growTime': 15
  },
  {
    'name': 'broccoli',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🥦',
    'growTime': 28
  }
]

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

// This function creates the HTML elements for the items/tools
function spawnItems() {

  // Set the amount of items
  hudItems.items = items.length;

  var createdItems = "";

  for (var i = 0; i < items.length; i++) {
    const item = `<button onmouseover="selectItemMouse(this.id)" onclick="selectItem(this.id)" id="item-${i}" class="item">${items[i].name.toUpperCase()}</button></br>`;
    createdItems += item;
  }
  $('.items').append(createdItems)
  $('#item-0').addClass('selected-item')

}

// This function creates the HTML elements for the crops
function spawnCrops() {

  // Set the amount of items
  hudCrops.items = crops.length;

  var createdCrops = "";

  for (var i = 0; i < crops.length; i++) {
    const crop = `<button onmouseover="selectCropMouse(this.id)" onclick="selectCrop(this.id)" id="crop-${i}" class="crop">${crops[i].name.toUpperCase()}</button></br>`;
    createdCrops += crop;
  }
  $('.crops').append(createdCrops)
  $('#crop-0').addClass('selected-crop')

}

// When navigation the menu with the gamepad this function is used to select an item/tool
function selectItem() {
  //item = item.substr(item.length - 1);
  selectedItem = items[hudItems.selectedRow];
  $('#farm-selected-item').html(`Selected item:<span style="color: cyan"> ${selectedItem.name.toUpperCase()}</span>`);
  //for keybourd: hideAllHud()
  toggleItems()
  playSound('click');
}

// When navigation the menu with the gamepad this function is used to select an crop
function selectCrop() {
  //item = item.substr(item.length - 1);
  selectedItem = crops[hudCrops.selectedRow];
  $('#farm-selected-item').html(`Selected crop:<span style="color: rgb(255, 0, 242)"> ${selectedItem.name.toUpperCase()}</span>`);
  //for keybourd: hideAllHud()
  toggleCrops()
  playSound('click');
}

// This is to cut a crop once its finished, (Currently unused)
function cutItem() {
  if (grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop != 0) {
    grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop = 0;
    grid[screenGrid.selectedRow][screenGrid.selectedColumn].name = blocksPrefabs.dirt.name;
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).text('');
    updateMoney(blocksPrefabs.corn.value);
  }
}

// When a crop is selected this is used to plant a crop on an item
function plantCrop() {

  // Check if there is no crop and check if the block has been prepared (with a hoe)
  if (grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop == -1 && grid[screenGrid.selectedRow][screenGrid.selectedColumn].prepared) {
    // Emit an event to the Node.JS server to ask if we can place the crop
    socket.emit('plantCrop', farmId, screenGrid.selectedRow, screenGrid.selectedColumn, hudCrops.selectedRow)
  } else {
    showNotification(3000, "Prepare the land before trying to plant seeds", true)
  }
}

// This is called when you have  a hoe selected and want to prepare the land for a crop
function prepareBlock() {

  // Check if the land has not been prepared yet
  if (!grid[screenGrid.selectedRow][screenGrid.selectedColumn].prepared) {
    // Tell the server we would like to update the block to be prepared
    socket.emit('updateBlock', farmId, screenGrid.selectedRow, screenGrid.selectedColumn, 'dirt')
  }

}

// Unused function to update money in the UI
function updateMoney(moneyToAdd) {
  console.log(moneyToAdd)
  money += moneyToAdd;
  $('#farm-money').text(money + "$");
}


// create a new farm
function createFarm() {

  const name = $('#new-farm-name-input').val();
  const pass = $('#new-farm-pass-input').val();

  if (name && pass) {
    // Ask the server
    socket.emit('createFarm', name, pass)
  }

}

// Join a farm
function joinFarm() {
  // Split the 123456:password input into an array
  const values = $('#join-farm-input').val().split(":");
  if (values) {
    socket.emit('joinFarm', values[0], values[1])
  }

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
    $(`#${r}-${c}`).text(crops[grid[r][c].crop].icon);
    $(`#${r}-${c}`).css('fontSize', (screenGrid.blockHeight - 10));
  } else {
    // Update the font size every interval so it looks like its growing
    $(`#${r}-${c}`).text(crops[grid[r][c].crop].prematureIcon);
    let fontSize = parseFloat($(`#${r}-${c}`).css('fontSize')) + ((screenGrid.blockHeight - 10) / growTime);
    console.log("Inceremnt size: " + (screenGrid.blockHeight - 10) / growTime)
    $(`#${r}-${c}`).css('fontSize', fontSize + 'px');
  }
}

// This makes the notifications
function showNotification(duration, text, status) {

  // Get the elements
  var notiText = document.getElementById('noti-text');
  var notiBox = document.getElementById('noti-box');
  // Clear the current notifiation
  clearTimeout(notificationTimeout);

  // Set the properties
  notiText.innerHTML = text;
  notiText.style.fontSize = (screenGrid.blockHeight - 10) + "px";
  notiText.style.lineHeight = (screenGrid.blockHeight) + "px";

  if (status) {
    notiBox.style.backgroundColor = "cyan";
    notiText.style.color = "black";
  } else {
    notiText.style.color = "white";
    notiBox.style.backgroundColor = "crimson";
  }

  // Show it
  $('.noti-box').fadeIn("fast");

  // Start a timeout to hide it after given ms
  notificationTimeout = setTimeout(function () {
    notiText.innerHTML = "";
    $('.noti-box').fadeOut("fast");
    notificationTimeout = -1;
  }, duration)

}


// If a farm is created by the server try to join it
socket.on('farmCreated', (id, password) => {
  socket.emit('joinFarm', id, password)
})

// When a farm is joined
socket.on('farmJoined', (data) => {

  // Check if thers an error
  if (data.error) {
    alert(data.error)
  }
  // Set the variables
  farmId = data.settings[0].id;
  console.log(data)
  grid = data.grid[0].blocks;
  calcDimensions();
  $('#farm-money').text(`$${data.settings[0].money.toString().toUpperCase()}`)
  $('#farm-name').text(`${data.settings[0].name.toUpperCase()}'S FARM`)
  // Show game
  $('.startup-div').fadeToggle('fast', () => {
    loaded = true;
  });

})

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


// If the server has prepared the block, this will receive the update and will then update the grid variable
socket.on('singleBlockUpdate', (row, column) => {
  console.log(`Block updated ${row}x${column}`)
  grid[row][column].prepared = true;
  grid[row][column].name = blocksPrefabs.dirt.name;
  // apply the color
  $(`#${row}-${column}`).css('backgroundColor', blocksPrefabs.dirt.color);
  // It also plays a sound haha
  playSound('hoe');
})

// When the server has allowed the crop placement
socket.on('singleCropBlockUpdate', (row, column, cropid, growTime, startedGrowing) => {
  console.log(`Block updated ${row}x${column}`)
  grid[row][column].crop = cropid;
  grid[row][column].startedGrowing = startedGrowing;
  grid[row][column].growTime = growTime;
  // Push the crop to the growingBlocks so it is checked by the interval so it will visually grow
  growingBlocks.push({ r: row, c: column })
  // Set the text to the proper crop emoji
  $(`#${row}-${column}`).text(getCrop(row, column));
})
