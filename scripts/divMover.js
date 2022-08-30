const directionKeys = {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
}

const SPEED = 5;

let verticalMove = false;
let verticalMoveDiff = 0;

let horizontalMove = false;
let horizontalMoveDiff = 0;

let activeDiv;

let animationRunning = false;

function isArrowKey(key) {
    return (key.substring(0, 5) === "Arrow");
}

function initialize() {

    window.addEventListener("keydown", (keyEvent) => {

        if (isArrowKey(keyEvent.key)) {
            moveStart(keyEvent.key);
        }

    });

    window.addEventListener("keyup", (keyEvent) => {

        if (isArrowKey(keyEvent.key)) {
            moveStop(keyEvent.key);
        }

    });

    activeDiv = document.getElementById("moved-1");
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

    if (!animationRunning) {
        requestAnimationFrame(doMove);
        animationRunning = true;
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

    animationRunning = false;
}

function doMove() {

    if (verticalMove || horizontalMove) {

        const clientRect = activeDiv.getBoundingClientRect();

        const newLeft = clientRect.left + horizontalMoveDiff * SPEED;
        const newTop = clientRect.top + verticalMoveDiff * SPEED;

        activeDiv.style.left = `${newLeft}px`;
        activeDiv.style.top = `${newTop}px`;
    }

    if (animationRunning) {
        requestAnimationFrame(doMove);
    }
}

function changeSelection(radioButton) {
    activeDiv = radioButton.parentElement;
    radioButton.blur();
}