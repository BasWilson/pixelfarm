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


function select(button) {
    console.log(`Clicked ${gpButtons[button].name}`);
}

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
    if (direction == 12) {
        if (hudItems.selectedRow > 0) {
            $(`#item-${hudItems.selectedRow}`).removeClass('selected-item');
            hudItems.selectedRow--;
            $(`#item-${hudItems.selectedRow}`).addClass('selected-item');
        }
    } else if (direction == 13) {
        if (hudItems.selectedRow < hudItems.items -1) {
            $(`#item-${hudItems.selectedRow}`).removeClass('selected-item');
            hudItems.selectedRow++;
            $(`#item-${hudItems.selectedRow}`).addClass('selected-item');
        }
    }
}


function hudCropNavigate(direction) {
    if (direction == 12) {
        if (hudCrops.selectedRow > 0) {
            $(`#item-${hudCrops.selectedRow}`).removeClass('selected-crop');
            hudCrops.selectedRow--;
            $(`#item-${hudCrops.selectedRow}`).addClass('selected-crop');
        }
    } else if (direction == 13) {
        if (hudCrops.selectedRow < hudCrops.items -1) {
            $(`#item-${hudCrops.selectedRow}`).removeClass('selected-crop');
            hudCrops.selectedRow++;
            $(`#item-${hudCrops.selectedRow}`).addClass('selected-crop');
        }
    }
}


movement = {
    down: function () {
        if (screenGrid.selectedRow < screenGrid.rows - 1) {
            // Remove the class from the previous selected one
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
            // Update the selected row
            screenGrid.selectedRow++;
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

function toggleCrops () {
    $('.crops').fadeToggle('fast', () => {
        if ($('.crops').css('display') != 'none') {
            $('.hud').fadeIn('fast')
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block')
            gpButtons[0].function = selectCrop;
            gpButtons[12].function = hudCropNavigate;
            gpButtons[13].function = hudCropNavigate;
            gpButtons[14].function = hudCropNavigate;
            gpButtons[15].function = hudCropNavigate;
        } else {
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
            gpButtons[0].function = blockInteraction;
            gpButtons[12].function = move;
            gpButtons[13].function = move;
            gpButtons[14].function = move;
            gpButtons[15].function = move;
        }
    })
}

function toggleItems () {
    $('.items').fadeToggle('fast', () => {
        if ($('.items').css('display') != 'none') {
            $('.hud').fadeIn('fast')
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
            gpButtons[0].function = selectItem;
            gpButtons[12].function = hudItemNavigate;
            gpButtons[13].function = hudItemNavigate;
            gpButtons[14].function = hudItemNavigate;
            gpButtons[15].function = hudItemNavigate;
        } else {
            $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
            gpButtons[0].function = blockInteraction;
            gpButtons[12].function = move;
            gpButtons[13].function = move;
            gpButtons[14].function = move;
            gpButtons[15].function = move;
        }
    })
}

function hideAllHud() {
    $('.hud').fadeOut('fast')
    $('.crops').fadeOut('fast')
    $('.items').fadeOut('fast')
}