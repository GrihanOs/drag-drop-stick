import { DivWrapper } from "./divWrapper.js";

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
let activeDivWrapper;

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
	})

	document.querySelectorAll(".movable-div input").forEach((divSelector) => {
		divSelector.addEventListener("change", changeSelection);
	})

	activeDiv = document.getElementById("moved-1");
	activeDivWrapper = divWrappers[0];
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

		activeDivWrapper.move(verticalMoveDiff, horizontalMoveDiff);

		activeDivWrapper.render();
	}

	if (animationRunning) {
		requestAnimationFrame(doMove);
	}
}

function changeSelection(event) {
	const radioButton = event.srcElement;
	activeDiv = radioButton.parentElement;
	radioButton.blur();
	activeDivWrapper = divWrappers.find((divWrapper) => divWrapper.id === activeDiv.id);
}

window.addEventListener("load", initialize);

// export default initialize;