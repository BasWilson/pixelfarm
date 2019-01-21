function listOnMarketplace () {
    console.log("Listing")
    socket.emit('listOnMarketplace', settings.id, cropInventory[hudInventoryItems.selectedRow].name);
}

function loadInventory () {
    
    hudInventoryItems.items = cropInventory.length;

    $(".inventory-items").empty();
    var items = "";
    for (let i = 0; i < cropInventory.length; i++) {
        const item = cropInventory[i];
        items += `
            <div id="inventory-item-${i}" class="inventory-item">
                <a>${item.icon}</a>
                <a>${item.name}</a>
                <a id="inventory-item-amount-${i}" >${item.amount}x</a>
                <a><span style="color: #AEE7FF">${(item.growTime / 60).toFixed(1)}</span> min</a>
                </div>
        `;
    }
    $(".inventory-items").append(items);
}


socket.on("inventoryUpdate", (data) => {
    cropInventory = data.crops;
    loadInventory();
})