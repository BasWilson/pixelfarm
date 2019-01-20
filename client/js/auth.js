// create a new farm
function createFarm() {

    if ($('#new-div').css('display') == 'none') {
      $('#join-div').hide('fast');
      $('#new-div').show('fast');
      return;
    }
  
    const name = $('#new-farm-name-input').val();
    const pass = $('#new-farm-pass-input').val();
  
    if (name && pass) {
      // Ask the server
      socket.emit('createFarm', name, pass)
    } else {
      $("#new-farm-name-input").effect("shake", { times: 3, distance: 50 });
      $("#new-farm-pass-input").effect("shake", { times: 3, distance: 50 });
    }
  
  }
  
  // Join a farm
  function joinFarm() {
  
    // check if the menu is closed
    if ($('#join-div').css('display') == 'none') {
      $('#new-div').hide('fast');
      $('#join-div').show('fast');
      return;
    }
    // Split the 123456:password input into an array
    const values = $('#join-farm-input').val().split(":");
    const id = values[0];
    const pass = values[1];
    if (id && pass) {
      socket.emit('joinFarm', id, pass)
    } else {
      $("#join-farm-input").effect("shake", { times: 3, distance: 50 });
    }
  
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
    settings = data.settings[0];
    console.log(data)
    grid = data.grid[0].blocks;
    itemInventory = data.itemInventory[0].items;
    cropInventory = data.cropInventory[0].crops;
    calcDimensions();
    $('#farm-money').text(`$${settings.money.toString().toUpperCase()}`)
    $('#farm-name').text(`${settings.name.toUpperCase()}'S FARM`)
    $('#farm-id').text(`SHARE ID: ${settings.id}`)
    calculateLevel();
    // Show game
    $('#wrapper').fadeToggle('fast', () => {
      loaded = true;
    });
  
  })
  