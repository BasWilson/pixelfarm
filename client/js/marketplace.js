function retrieveMarketplace () {
    socket.emit("retrieveMarketplace", settings.id);
}

function purchaseItemFromMarketplace () {
    console.log("Buying", hudMarketplaceItems.selectedRow);
    console.log($(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).data('id'))

    socket.emit("buyFromMarketplace", settings.id, $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).data('id'));
}

socket.on("marketplaceData", (data) => {

    console.log(data);
    
    if (data.length < 1) {
        $(".marketplace-items").empty();
        return showNotification(3000, "There are currently no listings on the marketplace", false)
    }

    hudMarketplaceItems.items = data.length;

    $(".marketplace-items").empty();
    var items = "";
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        items += `
            <div id="marketplace-item-${i}" data-id="${item.listingId}" class="marketplace-item">
                <a class="marketplace-item-icon">${item.icon}</a>
                <a class="marketplace-item-name">${item.name}</a>
                <a class="marketplace-item-lvl">Lvl ${item.level}</a>
                <a class="marketplace-item-price">Lowest price: ${item.price}$</a>
            </div>
        `;
    }
    $(".marketplace-items").append(items);

    if (hudMarketplaceItems.selectedRow >= 1) {
        hudMarketplaceItems.selectedRow--;
    } else if (hudMarketplaceItems.items == 1) {
        hudMarketplaceItems.selectedRow = 0;
    }
    $(`#marketplace-item-${hudMarketplaceItems.selectedRow}`).addClass('selected-marketplace-item');

})

socket.on('purchased', () => {
    playUISound("popup");
});

socket.on('itemSold', () => {
    playUISound("eshop");
    showNotification(4000, "You sold an item! The balance has been added", true, false)
});