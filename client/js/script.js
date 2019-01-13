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


// 🌱 🌽
var notificationTimeout = -1;
var money = 100;
const blocksPrefabs = {
  'grass': {
    'color': '#58B940',
    'name': 'grass'
  },
  'dirt': {
    'color': '#3F2909',
    'name': 'dirt'
  },
  'corn': {
    'color': 'yellow',
    'name': 'corn',
    'value': 50
  }
}

var blocks = [];
var grid = []
var farmId = 0;

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

const crops = [
  {
    'name': 'corn',
    'amount': 1,
    'use': plantCrop,
    'prematureIcon': '🌱',
    'icon': '🌽'
  }
]

const socket = io('http://188.166.122.43:4444');
var selectedCrop = 0;
var selectedItem = 0;

function calcDimensions() {

  // 25 x 20
  //const blocksOnWidth = Math.floor($('main').width() / 25);
  //const blocksOnHeight = Math.floor($('main').height() / 20);
  screenGrid.blockWidth = Math.floor($('main').width() / 25) - 2;
  screenGrid.blockHeight = Math.floor($('main').height() / 20) - 2;
  spawnFarm(25, 20) // columns and rows
  spawnItems();
  spawnCrops();

}

function spawnFarm(columns, rows) {

  screenGrid.columns = columns;
  screenGrid.rows = rows;

  var createdBlocks = "";

  // Create a row for every row
  for (let r = 0; r < rows; r++) {
    // Create a column for every column
    for (let c = 0; c < columns; c++) {
      const block = `<div onmouseover="selectBlockMouse(this.id)" onclick="blockInteraction()" style="width: ${screenGrid.blockWidth}px; height: ${screenGrid.blockHeight}px; border: 1px solid darkgreen; background-color: ${getColor(r,c)}" id="${r}-${c}" class="block">${getCrop(r,c)}</div>`;
      createdBlocks += block;
    }
  }

  $('.farm-field').append(createdBlocks);
  $(`.block`).css('lineHeight', screenGrid.blockHeight + 'px');
  $(`.block`).css('fontSize', (screenGrid.blockHeight - 10) + 'px');

  $('#0-0').addClass('selected-block')

}

function getColor (r, c) {
  for (var key in blocksPrefabs) {
    if (key == grid[r][c].name) {
      return blocksPrefabs[key].color;
    }
  }
}

function getCrop (r, c) {
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


function blockInteraction(id) {
  //var rowAndColumn = id.split("-");
  if (selectedItem) {
    selectedItem.use()
  } else {
    showNotification(2500, "Please select an item from your inventory")
  }
}

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


function selectItem() {
  //item = item.substr(item.length - 1);
  selectedItem = items[hudItems.selectedRow];
  $('#farm-selected-item').html(`Selected item:<span style="color: cyan"> ${selectedItem.name.toUpperCase()}</span>`);
  //for keybourd: hideAllHud()
  toggleItems()
  playSound('click');
}

function selectCrop() {
  //item = item.substr(item.length - 1);
  selectedItem = crops[hudCrops.selectedRow];
  $('#farm-selected-item').html(`Selected crop:<span style="color: rgb(255, 0, 242)"> ${selectedItem.name.toUpperCase()}</span>`);
  //for keybourd: hideAllHud()
  toggleCrops()
  playSound('click');
}

function cutItem() {
  if (grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop != 0) {
    grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop = 0;
    grid[screenGrid.selectedRow][screenGrid.selectedColumn].name = blocksPrefabs.dirt.name;
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).text('');
    updateMoney(blocksPrefabs.corn.value);
  }
}

function plantCrop() {

  if (grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop == -1 && grid[screenGrid.selectedRow][screenGrid.selectedColumn].prepared) {
    console.log("Can plant")
    socket.emit('plantCrop', farmId, screenGrid.selectedRow, screenGrid.selectedColumn, hudCrops.selectedRow)

    // grid[screenGrid.selectedRow][screenGrid.selectedColumn].crop = blocksPrefabs.corn.name;
    // grid[screenGrid.selectedRow][screenGrid.selectedColumn].name = blocksPrefabs.corn.name;
    // $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).text('🌱');
  } else {
    showNotification(3000, "Prepare the land before trying to plant seeds", true)
  }
}

function prepareBlock() {

  if (!grid[screenGrid.selectedRow][screenGrid.selectedColumn].prepared) {
    socket.emit('updateBlock', farmId, screenGrid.selectedRow, screenGrid.selectedColumn, 'dirt')
  }

  // grid[screenGrid.selectedRow][screenGrid.selectedColumn].prepared = true;
  // grid[screenGrid.selectedRow][screenGrid.selectedColumn].name = blocksPrefabs.dirt.name;
  // $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).css('backgroundColor', blocksPrefabs.dirt.color);

}

socket.on('singleBlockUpdate', (row, column) => {
  console.log(`Block updated ${row}x${column}`)
  grid[row][column].prepared = true;
  grid[row][column].name = blocksPrefabs.dirt.name;
  $(`#${row}-${column}`).css('backgroundColor', blocksPrefabs.dirt.color);
  playSound('hoe');
})

socket.on('singleCropBlockUpdate', (row, column, cropid) => {
  console.log(`Block updated ${row}x${column}`)
  grid[row][column].crop = cropid;
  $(`#${row}-${column}`).text(getCrop(row, column));
  
})

function updateMoney(moneyToAdd) {
  console.log(moneyToAdd)
  money += moneyToAdd;
  $('#farm-money').text(money + "$");
}

function showNotification(duration, text, status) {
  var notiText = document.getElementById('noti-text');
  var notiBox = document.getElementById('noti-box');
  clearTimeout(notificationTimeout);

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
  $('.noti-box').fadeIn("fast");

  //Stel de tijd in in ms dat het boxje er moet blijven dmv de setTimeout functie. 
  notificationTimeout = setTimeout(function () {
    notiText.innerHTML = "";
    $('.noti-box').fadeOut("fast");
    notificationTimeout = -1;
  }, duration)

}

function createFarm() {

  const name = $('#new-farm-name-input').val();
  const pass = $('#new-farm-pass-input').val();

  if (name && pass) {
    socket.emit('createFarm', name, pass)
  }

}

function joinFarm() {
  const values = $('#join-farm-input').val().split(":");
  if (values) {
    socket.emit('joinFarm', values[0], values[1])
  }

}

socket.on('farmerJoined', (socketid) => {
  console.log(`Another farmer joined: ${socketid}`)
  if (socketid == socket.id) {
    setTimeout(() => {
      showNotification(3000, 'Welcome to the farm', true)
    }, 1000);
  } else {
    showNotification(3000, 'Another farmer joined', true)
  }

})

socket.on('farmCreated', (id, password) => {
  socket.emit('joinFarm', id, password)
})

socket.on('farmJoined', (data) => {
  if (data.error) {
    alert(data.error)
  }
  farmId = data.settings[0].id;
  console.log(data)
  grid = data.grid[0].blocks;
  calcDimensions();
  $('#farm-money').text(`$${data.settings[0].money.toString().toUpperCase()}`)
  $('#farm-name').text(`${data.settings[0].name.toUpperCase()}'S FARM`)
  $('.startup-div').fadeToggle('fast');

})


function moveSound (sound) {
  var s = new Audio(`sounds/${sound}.ogg`);
  s.loop = false;
  s.play();
}

function playSound (sound) {
  var s = new Audio(`sounds/${sound}.ogg`);
  s.loop = false;
  s.play();
}