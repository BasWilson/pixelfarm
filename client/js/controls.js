var screenGrid = {
    columns: 0,
    rows: 0,
    selectedColumn: 0,
    selectedRow: 0,
    currentBlock: 0,
    blockWidth: 0,
    blockHeight: 0,
}

var hudItems = {
    items: 0,
    selectedRow: 0
}

var hudCrops = {
    items: 0,
    selectedRow: 0
}

var hudMarketplaceItems = {
    items: 0,
    selectedRow: 0
}

var hudManagementItems = {
    items: 2,
    selectedRow: 0
}

var hudInventoryItems = {
    items: 0,
    selectedRow: 0
}

// Just the generic function when an unassinged button is pressed
function select(button) {
    console.log(`Clicked ${gpButtons[button].name}`);
}

// The move function called by button events
function move(direction) {
    if (direction == 12) {
        movement.up();
    } else if (direction == 13) {
        movement.down();
    } else if (direction == 14) {
        movement.left();
    } else if (direction == 15) {
        movement.right();
    }
}

function hudItemNavigate(direction) {
    // Button is dpad_up 
    if (direction == 12) {
        if (hudItems.selectedRow > 0) {
            // change the selcted html element
            $(`#item-${hudItems.selectedRow}`).removeClass('selected-item');
            hudItems.selectedRow--;
            $(`#item-${hudItems.selectedRow}`).addClass('selected-item');
        }
        // Button is dpad_down
    } else if (direction == 13) {
        if (hudItems.selectedRow < hudItems.items - 1) {
            $(`#item-${hudItems.selectedRow}`).removeClass('selected-item');
            hudItems.selectedRow++;
            $(`#item-${hudItems.selectedRow}`).addClass('selected-item');
        }
    }
}

// Same as above
function hudCropNavigate(direction) {
    if (direction == 12) {
        if (hudCrops.selectedRow > 0) {
            $(`#crop-${hudCrops.selectedRow}`).removeClass('selected-crop');
            hudCrops.selectedRow--;
            $(`#crop-${hudCrops.selectedRow}`).addClass('selected-crop');
        }
    } else if (direction == 13) {
        if (hudCrops.selectedRow < hudCrops.items - 1) {
            $(`#crop-${hudCrops.selectedRow}`).removeClass('selected-crop');
            hudCrops.selectedRow++;
            $(`#crop-${hudCrops.selectedRow}`).addClass('selected-crop');
        }
    }
}

function hudMarketplaceNavigate(direction) {
    if (direction == 12) {
        if (hudMarketplaceItems.selectedRow > 0) {
            $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).removeClass('selected-marketplace-item');
            hudMarketplaceItems.selectedRow--;
            $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).addClass('selected-marketplace-item');
        }
    } else if (direction == 13) {
        if (hudMarketplaceItems.selectedRow < hudMarketplaceItems.items - 1) {
            $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).removeClass('selected-marketplace-item');
            hudMarketplaceItems.selectedRow++;
            $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).addClass('selected-marketplace-item');
        }
    }
}

function hudManagementNavigate(direction) {
    if (direction == 12) {
        if (hudManagementItems.selectedRow > 0) {
            $(`#management-item-${hudManagementItems.selectedRow}`).removeClass('selected-management-item');
            hudManagementItems.selectedRow--;
            $(`#management-item-${hudManagementItems.selectedRow}`).addClass('selected-management-item');
        }
    } else if (direction == 13) {
        if (hudManagementItems.selectedRow < hudManagementItems.items - 1) {
            $(`#management-item-${hudManagementItems.selectedRow}`).removeClass('selected-management-item');
            hudManagementItems.selectedRow++;
            $(`#management-item-${hudManagementItems.selectedRow}`).addClass('selected-management-item');
        }
    }
}


function hudInventoryNavigate(direction) {
    if (direction == 12) {
        if (hudInventoryItems.selectedRow > 0) {
            $(`#inventory-item-${hudInventoryItems.selectedRow}`).removeClass('selected-inventory-item');
            hudInventoryItems.selectedRow--;
            $(`#inventory-item-${hudInventoryItems.selectedRow}`).addClass('selected-inventory-item');
        }
    } else if (direction == 13) {
        if (hudInventoryItems.selectedRow < hudInventoryItems.items - 1) {
            $(`#inventory-item-${hudInventoryItems.selectedRow}`).removeClass('selected-inventory-item');
            hudInventoryItems.selectedRow++;
            $(`#inventory-item-${hudInventoryItems.selectedRow}`).addClass('selected-inventory-item');
        }
    }
}

    // These handle the movement on the grid
    movement = {
        down: function () {
            if (screenGrid.selectedRow < screenGrid.rows - 1) {
                // Remove the class from the previous selected one
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
                // Update the selected row
                screenGrid.selectedRow++;
                // Set the newly selected block as active
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
                screenGrid.currentBlock = screenGrid.selectedColumn * screenGrid.selectedRow;
                moveSound('move0');
            }
        },
        up: function () {
            if (screenGrid.selectedRow < screenGrid.rows && screenGrid.selectedRow != 0) {
                // Remove the class from the previous selected one
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
                // Update the selected row
                screenGrid.selectedRow--;
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
                screenGrid.currentBlock = screenGrid.selectedColumn * screenGrid.selectedRow;
                moveSound('move1');
            }
        },
        left: function () {
            if (screenGrid.selectedColumn < screenGrid.columns && screenGrid.selectedColumn != 0) {
                // Remove the class from the previous selected one
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
                // Update the selected row
                screenGrid.selectedColumn--;
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
                screenGrid.currentBlock = screenGrid.selectedColumn * screenGrid.selectedRow;
                moveSound('move2');
            }
        },
        right: function () {
            if (screenGrid.selectedColumn < screenGrid.columns - 1) {
                // Remove the class from the previous selected one
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
                // Update the selected row
                screenGrid.selectedColumn++;
                $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
                screenGrid.currentBlock = screenGrid.selectedColumn * screenGrid.selectedRow;
                moveSound('move3');
            }
        }
    }