function selectBlockMouse (id) {
  var rowAndColumn = id.split("-");
  $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).removeClass('selected-block');
  screenGrid.selectedRow = parseInt(rowAndColumn[0]);
  screenGrid.selectedColumn = parseInt(rowAndColumn[1]);
  $(`#${screenGrid.selectedRow}-${screenGrid.selectedColumn}`).addClass('selected-block')
}

function selectItemMouse (id) {
  id = id.substr(id.length - 1);
  $(`#item-${hudItems.selectedRow}`).removeClass('selected-item');
  hudItems.selectedRow = id;
  $(`#item-${hudItems.selectedRow}`).addClass('selected-item');
}

function selectCropMouse (id) {
  id = id.substr(id.length - 1);
  $(`#crop-${hudCrops.selectedRow}`).removeClass('selected-crop');
  hudCrops.selectedRow = id;
  $(`#crop-${hudCrops.selectedRow}`).addClass('selected-crop');
}