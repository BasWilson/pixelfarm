
// This function creates the HTML elements for the items/tools
function spawnItems() {

    // Set the amount of items
    hudItems.items = itemInventory.length;
  
    var createdItems = "";
  
    for (let it = 0; it < itemInventory.length; it++) {
      for (var i = 0; i < items.length; i++) {
        if (itemInventory[it].name == items[i].name) {
          // Apply use property
          itemInventory[it].use = items[i].use
  
          // Create the UI element
          const item = `<button onmouseover="selectItemMouse(this.id)" onclick="selectItem(this.id)" id="item-${it}" class="item">${itemInventory[it].name.toUpperCase()}</button></br>`;
          createdItems += item;
  
        }
  
      }
    }
  
    $('.items').append(createdItems)
    $('#item-0').addClass('selected-item')
  
  }


// This function creates the HTML elements for the crops
function spawnCrops() {

    // Set the amount of items
    hudCrops.items = cropInventory.length;
  
    var createdCrops = "";
  
    for (let it = 0; it < cropInventory.length; it++) {
      for (var i = 0; i < crops.length; i++) {
        if (cropInventory[it].name == crops[i].name) {
          cropInventory[it].use = crops[i].use
          const crop = `<button onmouseover="selectCropMouse(this.id)" onclick="selectCrop(this.id)" id="crop-${it}" class="crop">${cropInventory[it].name.toUpperCase()} </button>${cropInventory[it].amount}x</br>`;
          createdCrops += crop;
        }
      }
    }
    $('.crops').append(createdCrops)
    $('#crop-0').addClass('selected-crop')
  
  }
  
  // When navigation the menu with the gamepad this function is used to select an item/tool
  function selectItem() {
    //item = item.substr(item.length - 1);
    selectedItem = itemInventory[hudItems.selectedRow];
    $('#farm-selected-item').html(`Selected item:<span style="color: cyan"> ${selectedItem.name.toUpperCase()}</span>`);
    //for keybourd: hideAllHud()
    toggleItems()
    playSound('click');
  }
  
  // When navigation the menu with the gamepad this function is used to select an crop
  function selectCrop() {
    //item = item.substr(item.length - 1);
    selectedItem = cropInventory[hudCrops.selectedRow];
    $('#farm-selected-item').html(`Selected crop:<span style="color: rgb(255, 0, 242)"> ${selectedItem.name.toUpperCase()}</span>`);
    //for keybourd: hideAllHud()
    toggleCrops()
    playSound('click');
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
  