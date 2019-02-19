function retrieveShop () {
    socket.emit("retrieveShop", settings.id);
}

function purchaseItemFromShop () {
    console.log("Buying", hudShopItems.selectedRow);
    socket.emit("buyFromShop", settings.id, hudShopItems.selectedRow);
}

socket.on("shopData", (data) => {

    console.log(data);
    
    if (data.length < 1) {
        $(".shop-items").empty();
        return showNotification(3000, "The shop is currenty out of stock", false)
    }

    hudShopItems.items = data.length;

    $(".shop-items").empty();
    var items = "";
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        var style= "";
        if (item.level > level) {
            style = 'opacity: .7';
            console.log("to low")
        }
        items += `
            <div style="${style}" id="shop-item-${i}" data-id="${item.listingId}" class="shop-item">
            <a>${item.icon}</a>
            <a>${item.name}</a>
            <a>Lvl ${item.level}</a>
            <a>$ ${item.price}</a>
            <a><span style="color: #AEE7FF">${(item.growTime / 60).toFixed(1)}</span> min</a>
            </div>
        `;
    }
    $(".shop-items").append(items);

    if (hudShopItems.items == 1) {
        hudShopItems.selectedRow = 0;
    }
    $(`#shop-item-${hudShopItems.selectedRow}`).addClass('selected-shop-item');

})