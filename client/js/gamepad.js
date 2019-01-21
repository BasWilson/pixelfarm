var connected = false;

// All gamepad buttons with their properties
var gpButtons = [
    { inUse: false, name: "Cross", function: blockInteraction },
    { inUse: false, name: "Circle", function: select },
    { inUse: false, name: "Square", function: toggleCrops },
    { inUse: false, name: "Triangle", function: toggleItems },
    { inUse: false, name: "Left bumper", function: select },
    { inUse: false, name: "Right bumper", function: select },
    { inUse: false, name: "Left trigger", function: select },
    { inUse: false, name: "Right trigger", function: select },
    { inUse: false, name: "Select", function: toggleManagementMenu },
    { inUse: false, name: "Start", function: select },
    { inUse: false, name: "Left stick", function: select },
    { inUse: false, name: "Right stick", function: select },
    { inUse: false, name: "D-PAD Up", function: move, lastUsed: Date.now() },
    { inUse: false, name: "D-PAD Down", function: move, lastUsed: Date.now() },
    { inUse: false, name: "D-PAD Left", function: move, lastUsed: Date.now() },
    { inUse: false, name: "D-PAD Right", function: move, lastUsed: Date.now() },
]

// Listen for the disconnect of a gamepad
window.addEventListener("gamepaddisconnected", function (e) {
    console.log("Waiting for gamepad.");
    connected = false;
    showNotification(99999*99999, "🎮 Please connect a controller", false);
    cancelRequestAnimationFrame(start);
});

// When a controller connects
window.addEventListener("gamepadconnected", function (e) {
    // asign this gamepad event as the current gamepad
    var gp = navigator.getGamepads()[e.gamepad.index];
    connected = true;
    showNotification(2500, "🎮 Controller has been connected", true);
    update();
});

var conInterval = setInterval(() => {
    if (loaded && !connected) {
        showNotification(99999*99999, "🎮 Please connect a controller", false);
    }
}, 1000);

if (!('ongamepadconnected' in window)) {
    // No gamepad events available, poll instead.
    interval = setInterval(pollGamepads, 500);
}

function pollGamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    for (var i = 0; i < gamepads.length; i++) {
        var gp = gamepads[i];
        if (gp) {
            update();
            clearInterval(interval);
        }
    }
}
// when a buttons is pressed
function buttonPressed(b) {
    if (typeof (b) == "object") {
        // return the state of the button
        return b.pressed;
    }
}

// Function that is ran every frame while a controller is connected
function update() {
    // Check if there is a gamepad
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads) {
        return;
    }

    // Asign the gamepad
    var gp = gamepads[0];

    // Listen for a button press
    for (let i = 0; i < gpButtons.length; i++) {
        if (buttonPressed(gp.buttons[i])) {
            // Check if the button is not in use
            if (!gpButtons[i].inUse) {
                // Set in use so the button is not triggerd endlessly while holding it
                gpButtons[i].inUse = true;
                // Executing the function that is assigned to this button
                gpButtons[i].function(i);

            }
        }
    }

    // Set buttons to false when not being used
    for (let i = 0; i < gpButtons.length; i++) {
        if (gp.buttons[i].value != 1) {
            if (gpButtons[i].inUse) {
                gpButtons[i].inUse = false;
            }
        }
    }

    // Check every frame
    start = requestAnimationFrame(update);

}

