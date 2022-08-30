const directionKeys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
}

const SPEED = 5;

let verticalMove = false;
let verticalMoveDiff = 0;

let horizontalMove = false;
let horizontalMoveDiff = 0;

let activeDiv;

function initialize() {

    window.addEventListener("keydown", (keyEvent) => {

        if (keyEvent.keyCode >= 37 &&
            keyEvent.keyCode <= 40) {
            moveStart(keyEvent.keyCode);
        }

    });

    window.addEventListener("keyup", (keyEvent) => {

        if (keyEvent.keyCode >= 37 &&
            keyEvent.keyCode <= 40) {
            moveStop(keyEvent.keyCode);
        }

    });

    activeDiv = document.getElementById("moved-1");

    requestAnimationFrame(doMove);
}

function moveStart(directionKey) {

    if (directionKey === directionKeys.UP ||
        directionKey === directionKeys.DOWN) {

        verticalMove = true;

        if (directionKey === directionKeys.UP) {
            verticalMoveDiff = -1;
        } else {
            verticalMoveDiff = 1;
        }

    }

    if (directionKey === directionKeys.LEFT ||
        directionKey === directionKeys.RIGHT) {

        horizontalMove = true;

        if (directionKey === directionKeys.LEFT) {
            horizontalMoveDiff = -1;
        } else {
            horizontalMoveDiff = 1;
        }

    }
}

function moveStop(directionKey) {

    if (directionKey === directionKeys.UP ||
        directionKey === directionKeys.DOWN) {

        verticalMove = false;
        verticalMoveDiff = 0;

    }

    if (directionKey === directionKeys.LEFT ||
        directionKey === directionKeys.RIGHT) {

        horizontalMove = false;
        horizontalMoveDiff = 0;

    }

}

function doMove() {

    if (verticalMove || horizontalMove) {

        const clientRect = activeDiv.getBoundingClientRect();

        const newLeft = clientRect.left + horizontalMoveDiff * SPEED;
        const newTop = clientRect.top + verticalMoveDiff * SPEED;

        activeDiv.style.left = `${newLeft}px`;
        activeDiv.style.top = `${newTop}px`;
    }

    requestAnimationFrame(doMove);
}

function changeSelection(radioButton) {
    activeDiv = radioButton.parentElement;
    radioButton.blur();
}