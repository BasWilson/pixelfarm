var gpButtons = [
    { inUse: false, name: "Cross", function: blockInteraction },
    { inUse: false, name: "Circle", function: select },
    { inUse: false, name: "Square", function: toggleCrops },
    { inUse: false, name: "Triangle", function: toggleItems },
    { inUse: false, name: "Left bumper", function: select },
    { inUse: false, name: "Right bumper", function: select },
    { inUse: false, name: "Left trigger", function: select },
    { inUse: false, name: "Right trigger", function: select },
    { inUse: false, name: "Select", function: select },
    { inUse: false, name: "Start", function: select },
    { inUse: false, name: "Left stick", function: select },
    { inUse: false, name: "Right stick", function: select },
    { inUse: false, name: "D-PAD Up", function: move, lastUsed: Date.now() },
    { inUse: false, name: "D-PAD Down", function: move, lastUsed: Date.now() },
    { inUse: false, name: "D-PAD Left", function: move, lastUsed: Date.now() },
    { inUse: false, name: "D-PAD Right", function: move, lastUsed: Date.now() },
]


window.addEventListener("gamepaddisconnected", function (e) {
    console.log("Waiting for gamepad.");
    cancelRequestAnimationFrame(start);
});

window.addEventListener("gamepadconnected", function (e) {
    var gp = navigator.getGamepads()[e.gamepad.index];
    update();
});

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

function buttonPressed(b) {
    if (typeof (b) == "object") {
        return b.pressed;
    }
}

function update() {

    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads) {
        return;
    }

    var gp = gamepads[0];

    // Listen for a button press
    for (let i = 0; i < gpButtons.length; i++) {
        if (buttonPressed(gp.buttons[i])) {
            if (!gpButtons[i].inUse) {
                gpButtons[i].inUse = true;
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

