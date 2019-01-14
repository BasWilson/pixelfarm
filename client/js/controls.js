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

// The toggle functions are to toggle the menus for crops and items
function toggleCrops() {
    // fade out or in crops menu
    $('.crops').fadeToggle('fast', () => {
        // if crops is being shown we show the hud , else we hide hud and show the crops
        if ($('.crops').css('display') != 'none') {
            $('.hud').fadeIn('fast')
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block')
            // Change the button functions
            gpButtons[0].function = selectCrop;
            gpButtons[1].function = toggleCrops;
            gpButtons[12].function = hudCropNavigate;
            gpButtons[13].function = hudCropNavigate;
            gpButtons[14].function = hudCropNavigate;
            gpButtons[15].function = hudCropNavigate;
            // Change the displayed buttons so you know what to do
            changeButtons([{ button: 'dpad_down', text: 'Next' }, { button: 'dpad_up', text: 'Previous' }, { button: 'x', text: 'Select' }, { button: 'circle', text: 'Close' },]);
        } else {
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
            gpButtons[1].function = select;
            gpButtons[0].function = blockInteraction;
            gpButtons[12].function = move;
            gpButtons[13].function = move;
            gpButtons[14].function = move;
            gpButtons[15].function = move;
            // Change the displayed buttons so you know what to do
            changeButtons([{ button: 'square', text: 'Crops' }, { button: 'triangle', text: 'Tools' }]);
        }
    })
}

function toggleItems() {
    $('.items').fadeToggle('fast', () => {
        if ($('.items').css('display') != 'none') {
            $('.hud').fadeIn('fast')
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
            gpButtons[1].function = toggleItems;
            gpButtons[0].function = selectItem;
            gpButtons[12].function = hudItemNavigate;
            gpButtons[13].function = hudItemNavigate;
            gpButtons[14].function = hudItemNavigate;
            gpButtons[15].function = hudItemNavigate;
            // Change the displayed buttons so you know what to do
            changeButtons([{ button: 'dpad_down', text: 'Next' }, { button: 'dpad_up', text: 'Previous' }, { button: 'x', text: 'Select' }, { button: 'circle', text: 'Close' },]);
        } else {
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
            gpButtons[1].function = select;
            gpButtons[0].function = blockInteraction;
            gpButtons[12].function = move;
            gpButtons[13].function = move;
            gpButtons[14].function = move;
            gpButtons[15].function = move;
            // Change the displayed buttons so you know what to do
            changeButtons([{ button: 'square', text: 'Crops' }, { button: 'triangle', text: 'Tools' }]);
        }
    })
}

// The buttons shown on the ui
function changeButtons(buttonArray) {
    $('.buttons').empty()
    for (let i = 0; i < buttonArray.length; i++) {
        const btn = `<p>${buttonArray[i].text}<img src="images/${buttonArray[i].button}_button.png" /></p>`;
        $('.buttons').append(btn)
    }
}
function hideAllHud() {
    $('.hud').fadeOut('fast')
    $('.crops').fadeOut('fast')
    $('.items').fadeOut('fast')
}