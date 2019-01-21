function retrieveMarketplace () {
    socket.emit("retrieveMarketplace");
}

function purchaseItemFromMarketplace () {
    console.log("Buying")
}

socket.on("marketplaceData", (data) => {

    console.log(data);
    
    if (data.length < 1) {
        return showNotification(3000, "There are currently no listings on the marketplace", false)
    }

    hudMarketplaceItems.items = data.length;

    $(".marketplace-items").empty();
    var items = "";
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        items += `
            <div id="marketplace-item-${i}" class="marketplace-item">
                <a class="marketplace-item-icon">${item.icon}</a>
                <a class="marketplace-item-name">${item.name}</a>
                <a class="marketplace-item-lvl">Lvl ${item.level}</a>
                <a class="marketplace-item-price">Lowest price: ${item.price}$</a>
            </div>
        `;
    }
    $(".marketplace-items").append(items);

})