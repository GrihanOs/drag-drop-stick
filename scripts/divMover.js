import { DivWrapper } from "./divWrapper.js";

const directionKeys = {
	UP: "ArrowUp",
	DOWN: "ArrowDown",
	LEFT: "ArrowLeft",
	RIGHT: "ArrowRight",
}

const activeKeys = {}

let verticalMove = false;
let verticalMoveDiff = 0;

let horizontalMove = false;
let horizontalMoveDiff = 0;

let animationRunning = false;

function isArrowKey(key) {
	return (key.substring(0, 5) === "Arrow");
}

const divWrappers = [];

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

	document.querySelectorAll(".movable-div").forEach((div) => {
		divWrappers.push(new DivWrapper(div))
	});
}

function moveStart(directionKey) {

	activeKeys[directionKey] = true;

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

	activeKeys[directionKey] = false;

	if (!activeKeys[directionKeys.UP] && !activeKeys[directionKeys.DOWN]) {
		verticalMove = false;
		verticalMoveDiff = 0;
	} else if (directionKey === directionKeys.UP) {
		moveStart(directionKeys.DOWN);
	} else if (directionKey === directionKeys.DOWN) {
		moveStart(directionKeys.UP);
	}

	if (!activeKeys[directionKeys.LEFT] && !activeKeys[directionKeys.RIGHT]) {
		horizontalMove = false;
		horizontalMoveDiff = 0;
	} else if (directionKey === directionKeys.LEFT) {
		moveStart(directionKeys.RIGHT);
	} else if (directionKey === directionKeys.RIGHT) {
		moveStart(directionKeys.LEFT);
	}

	animationRunning = verticalMove || horizontalMove;
}

function doMove() {

	if (verticalMove || horizontalMove) {

		DivWrapper.activeDiv.move(verticalMoveDiff, horizontalMoveDiff);

		DivWrapper.activeDiv.render();
	}

	if (animationRunning) {
		requestAnimationFrame(doMove);
	}
}

window.addEventListener("load", initialize);