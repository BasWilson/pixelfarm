// This makes the notifications
function showNotification(duration, text, status, sound = true) {

  // Get the elements
  var notiText = document.getElementById('noti-text');
  var notiBox = document.getElementById('noti-box');
  // Clear the current notifiation
  clearTimeout(notificationTimeout);

  // Set the properties
  notiText.innerHTML = text;

  console.log(status)
  if (status) {
    notiBox.style.backgroundColor = "rgba(174, 231, 255, .5)";
    notiText.style.color = "black";
  } else {
    notiText.style.color = "white";
    notiBox.style.backgroundColor = "rgba(220,20,60, .5)";
  }

  // Show it
  $('.noti-box').show(300);

  if (sound) {
    playUISound('standby');

  }
  // Start a timeout to hide it after given ms
  notificationTimeout = setTimeout(function () {
    $('.noti-box').hide(300);
    notificationTimeout = -1;
  }, duration)

}

// The toggle functions are to toggle the menus for crops and items
function toggleCrops() {
  socket.emit('retrieveInventory', settings.id);
  // if crops is being shown we show the hud , else we hide hud and show the crops
  if ($('.crops').css('display') == 'none') {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block')
    // Change the button functions
    gpButtons[0].function = selectCrop;
    gpButtons[1].function = toggleCrops;
    gpButtons[12].function = hudCropNavigate;
    gpButtons[13].function = hudCropNavigate;
    gpButtons[14].function = hudCropNavigate;
    gpButtons[15].function = hudCropNavigate;
    setActiveHudLayers(['.hud', '.crops', '.farm-field', '.farm-settings'])
  } else {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
    gpButtons[1].function = select;
    gpButtons[0].function = blockInteraction;
    gpButtons[12].function = move;
    gpButtons[13].function = move;
    gpButtons[14].function = move;
    gpButtons[15].function = move;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.farm-field', '.farm-settings'])
  }
  playUISound("turnon");

}

function toggleItems() {
  if ($('.items').css('display') == 'none') {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
    gpButtons[1].function = toggleItems;
    gpButtons[0].function = selectItem;
    gpButtons[12].function = hudItemNavigate;
    gpButtons[13].function = hudItemNavigate;
    gpButtons[14].function = hudItemNavigate;
    gpButtons[15].function = hudItemNavigate;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.hud', '.items', '.farm-field', '.farm-settings'])
  } else {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
    gpButtons[1].function = select;
    gpButtons[0].function = blockInteraction;
    gpButtons[12].function = move;
    gpButtons[13].function = move;
    gpButtons[14].function = move;
    gpButtons[15].function = move;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.farm-field', '.farm-settings'])
  }
  playUISound("turnon");
}

function toggleMarketplace() {
  if ($('.marketplace').css('display') == 'none') {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
    gpButtons[1].function = toggleManagementMenu;
    gpButtons[0].function = purchaseItemFromMarketplace;
    gpButtons[12].function = hudMarketplaceNavigate;
    gpButtons[13].function = hudMarketplaceNavigate;
    gpButtons[14].function = hudMarketplaceNavigate;
    gpButtons[15].function = hudMarketplaceNavigate;
    // Change the displayed buttons so you know what to do
    retrieveMarketplace();
    setActiveHudLayers(['.farm-field', '.marketplace']);
    $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).addClass('selected-marketplace-item');
  } else {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
    gpButtons[1].function = select;
    gpButtons[0].function = blockInteraction;
    gpButtons[12].function = move;
    gpButtons[13].function = move;
    gpButtons[14].function = move;
    gpButtons[15].function = move;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.farm-field', '.farm-settings'])
    $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).removeClass('selected-marketplace-item');
  }
  playUISound("turnon");
}

function toggleShop() {
  if ($('.shop').css('display') == 'none') {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
    gpButtons[1].function = toggleManagementMenu;
    gpButtons[0].function = purchaseItemFromShop;
    gpButtons[12].function = hudShopNavigate;
    gpButtons[13].function = hudShopNavigate;
    gpButtons[14].function = hudShopNavigate;
    gpButtons[15].function = hudShopNavigate;
    // Change the displayed buttons so you know what to do
    retrieveShop();
    setActiveHudLayers(['.farm-field', '.shop']);
    $(`#shop-item-${hudMarketplaceItems.selectedRow}`).addClass('selected-shop-item');
  } else {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
    gpButtons[1].function = select;
    gpButtons[0].function = blockInteraction;
    gpButtons[12].function = move;
    gpButtons[13].function = move;
    gpButtons[14].function = move;
    gpButtons[15].function = move;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.farm-field', '.farm-settings'])
    $(`#shop-item-${hudMarketplaceItems.selectedRow}`).removeClass('selected-shop-item');
  }
  playUISound("turnon");
}


function toggleManagementMenu () {
  if ($('.management').css('display') == 'none') {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
    gpButtons[1].function = toggleManagementMenu;
    gpButtons[0].function = selectManagementMenu;
    gpButtons[12].function = hudManagementNavigate;
    gpButtons[13].function = hudManagementNavigate;
    gpButtons[14].function = hudManagementNavigate;
    gpButtons[15].function = hudManagementNavigate;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.farm-field', '.management']);
    $(`#management-item-${hudManagementItems.selectedRow}`).addClass('selected-management-item');
  } else {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
    gpButtons[1].function = select;
    gpButtons[0].function = blockInteraction;
    gpButtons[12].function = move;
    gpButtons[13].function = move;
    gpButtons[14].function = move;
    gpButtons[15].function = move;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.farm-field', '.farm-settings'])
    $(`#management-item-${hudManagementItems.selectedRow}`).removeClass('selected-management-item');
  }
  playUISound("turnon");
}

function toggleInventoryMenu () {
  if ($('.inventory').css('display') == 'none') {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
    gpButtons[1].function = toggleManagementMenu;
    gpButtons[0].function = listOnMarketplace;
    gpButtons[12].function = hudInventoryNavigate;
    gpButtons[13].function = hudInventoryNavigate;
    gpButtons[14].function = hudInventoryNavigate;
    gpButtons[15].function = hudInventoryNavigate;
    // Change the displayed buttons so you know what to do
    loadInventory();
    setActiveHudLayers(['.farm-field', '.inventory']);
    $(`#inventory-item-${hudInventoryItems.selectedRow}`).addClass('selected-inventory-item');
  } else {
    $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
    gpButtons[1].function = select;
    gpButtons[0].function = blockInteraction;
    gpButtons[12].function = move;
    gpButtons[13].function = move;
    gpButtons[14].function = move;
    gpButtons[15].function = move;
    // Change the displayed buttons so you know what to do
    setActiveHudLayers(['.farm-field', '.management'])
    $(`#inventory-item-${hudInventoryItems.selectedRow}`).removeClass('selected-inventory-item');
  }
  playUISound("turnon");
}


var hudLayers = [
  {
    element: "#wrapper", // auth menu thingy
    buttons: []
  },
  {
    element: ".farm-settings",
    buttons: []
  },
  {
    element: ".farm-field", // game itself
    buttons: [{ button: 'triangle', text: 'Crops' }, { button: 'square', text: 'Items' }]
  },
  {
    element: ".hud",
    buttons: [{ button: 'square', text: 'Crops' }, { button: 'triangle', text: 'Tools' }],
  },
  {
    element: ".items",
    buttons: [{ button: 'x', text: 'Select' }, { button: 'circle', text: 'Close' }]
  },
  {
    element: ".crops",
    buttons: [{ button: 'x', text: 'Select' }, { button: 'circle', text: 'Close' }]
  },
  {
    element: ".marketplace",
    buttons: [{ button: 'x', text: 'Buy' }, { button: 'circle', text: 'Back' }]
  },
  {
    element: ".shop",
    buttons: [{ button: 'x', text: 'Buy' }, { button: 'circle', text: 'Back' }]
  },
  {
    element: ".inventory",
    buttons: [{ button: 'x', text: 'List on Marketplace' }, { button: 'circle', text: 'Back' }]
  },
  {
    element: ".management",
    buttons: [{ button: 'x', text: 'Select' }, { button: 'circle', text: 'Close' }]
  },
  
];

function setActiveHudLayers(layerArray) {
  for (let i = 0; i < hudLayers.length; i++) {
    $(hudLayers[i].element).hide();
    for (let z = 0; z < layerArray.length; z++) {
      if (layerArray[z] == hudLayers[i].element) {
        $(layerArray[z]).show();
        changeButtons(hudLayers[i].buttons);
      }
    }
  }
}

// The buttons shown on the ui
function changeButtons(buttonArray) {
  $('.buttons').empty()
  for (let i = 0; i < buttonArray.length; i++) {
    const btn = `<p>${buttonArray[i].text}<img src="images/${buttonArray[i].button}_button.png" /></p>`;
    $('.buttons').append(btn)
  }
}

function selectManagementMenu () {
  if (hudManagementItems.selectedRow == 0) {
    toggleMarketplace();
  } else if (hudManagementItems.selectedRow == 1)  {
    toggleInventoryMenu();
  } else {
    toggleShop();
  }
}

socket.on('errorMessage', (message) => {
  showNotification(3000, message, false);
})