const SPEED = 2;
const PROX_DISTANCE = 25;
const SCREEN_BEZEL = 10;

export class DivWrapper {

	static activeDiv = null;
	static draggedDiv = null;
	static allDivWrappers = [];

	constructor(divReference) {

		this.divReference = divReference;

		const boundingRect = this.divReference.getBoundingClientRect();
		this.actualPos = {
			top: boundingRect.top,
			left: boundingRect.left,
			height: boundingRect.height,
			width: boundingRect.width,
		}
		this.logicalPos = Object.assign({}, this.actualPos);

		this.selectorInput = divReference.querySelector(".movable-div-selector");

		this.divActivatedListener = this.divActivated.bind(this);
		this.draggingStartListener = this.draggingStart.bind(this);
		this.draggingEndListener = this.draggingEnd.bind(this);

		this.resetProximity();

		DivWrapper.activeDiv = DivWrapper.activeDiv || this;
		DivWrapper.allDivWrappers.push(this);
	}

	get id() {
		return this.divReference.id;
	}

	get top() {
		return this.actualPos.top;
	}

	get bottom() {
		return this.actualPos.top + this.actualPos.height;
	}

	get left() {
		return this.actualPos.left;
	}

	get right() {
		return this.actualPos.left + this.actualPos.width;
	}

	resetProximity() {

		this.proximity = {
			top: false,
			bottom: false,
			left: false,
			right: false,
			vertical: false,
			horizontal: false,
		}

	}

	divActivated() {
		DivWrapper.activeDiv.resetProximity();
		DivWrapper.activeDiv.render();
		DivWrapper.activeDiv = this;
		this.selectorInput.blur();
	}

	draggingStart() {
		DivWrapper.draggedDiv = this;
	}

	draggingEnd() {
		if (DivWrapper.draggedDiv) {
			DivWrapper.draggedDiv.resetProximity();
			DivWrapper.draggedDiv.render();
			DivWrapper.draggedDiv = null;
		}
	}

	draggingMove(movementY, movementX) {

		const newLeft = this.logicalPos.left + movementX;
		const newTop = this.logicalPos.top + movementY;

		this.logicalPos.left = newLeft;

		if (newLeft > SCREEN_BEZEL && newLeft + this.logicalPos.width < window.visualViewport.width - SCREEN_BEZEL) {
			this.actualPos.left = newLeft;
		}

		this.logicalPos.top = newTop;

		if (newTop > SCREEN_BEZEL && newTop + this.logicalPos.height < window.visualViewport.height - SCREEN_BEZEL) {
			this.actualPos.top = newTop;
		}

		this.proximityTest();
	}

	move(verticalMoveDiff, horizontalMoveDiff) {

		const newLeft = this.logicalPos.left + horizontalMoveDiff * SPEED;
		const newTop = this.logicalPos.top + verticalMoveDiff * SPEED;

		if (newLeft > SCREEN_BEZEL && newLeft + this.logicalPos.width < window.visualViewport.width - SCREEN_BEZEL) {
			this.logicalPos.left = newLeft;
			this.actualPos.left = newLeft;
		}

		if (newTop > SCREEN_BEZEL && newTop + this.logicalPos.height < window.visualViewport.height - SCREEN_BEZEL) {
			this.actualPos.top = newTop;
			this.logicalPos.top = newTop;
		}


		this.proximityTest();
	}

	draggingBezelTest() {

		if (this.actualPos.top < SCREEN_BEZEL) {
			this.actualPos.top = SCREEN_BEZEL;
		} else if (this.actualPos.top + this.logicalPos.height > window.visualViewport.height - SCREEN_BEZEL) {
			this.actualPos.top = window.visualViewport.height - SCREEN_BEZEL - this.logicalPos.height;
		}

		if (this.actualPos.left < SCREEN_BEZEL) {
			this.actualPos.left = SCREEN_BEZEL;
		} else if (this.actualPos.left + this.logicalPos.width > window.visualViewport.width - SCREEN_BEZEL) {
			this.actualPos.left = window.visualViewport.width - SCREEN_BEZEL - this.logicalPos.width;
		}

	}

	proximityTest() {

		this.resetProximity();

		const logicalTop = this.logicalPos.top;
		const logicalBottom = this.logicalPos.top + this.logicalPos.height;
		const logicalLeft = this.logicalPos.left;
		const logicalRight = this.logicalPos.left + this.logicalPos.width;

		DivWrapper.allDivWrappers.forEach((divWrapper) => {

			if (divWrapper.id !== this.id) {

				const intersectsVertical = ((logicalTop >= divWrapper.top && logicalTop <= divWrapper.bottom) || (divWrapper.top >= logicalTop && divWrapper.top <= logicalBottom));
				const intersectsHotizontal = ((logicalLeft >= divWrapper.left && logicalLeft <= divWrapper.right) || (divWrapper.left >= logicalLeft && divWrapper.left <= logicalRight));

				if (intersectsHotizontal) {

					if (!this.proximity.vertical && logicalTop - divWrapper.bottom > -PROX_DISTANCE && logicalTop - divWrapper.bottom <= PROX_DISTANCE) {
						this.proximity.top = true;
						this.actualPos.top -= logicalTop - divWrapper.bottom;
					}

					if (!this.proximity.vertical && divWrapper.top - logicalBottom > -PROX_DISTANCE && divWrapper.top - logicalBottom <= PROX_DISTANCE) {
						this.proximity.bottom = true;
						this.actualPos.top += divWrapper.top - logicalBottom;
					}

					this.proximity.vertical = this.proximity.top || this.proximity.bottom;
				}

				if (intersectsVertical) {

					if (!this.proximity.horizontal && logicalLeft - divWrapper.right > -PROX_DISTANCE && logicalLeft - divWrapper.right <= PROX_DISTANCE) {
						this.proximity.left = true;
						this.actualPos.left -= logicalLeft - divWrapper.right;
					}

					if (!this.proximity.horizontal && divWrapper.left - logicalRight > -PROX_DISTANCE && divWrapper.left - logicalRight <= PROX_DISTANCE) {
						this.proximity.right = true;
						this.actualPos.left += divWrapper.left - logicalRight;
					}

					this.proximity.horizontal = this.proximity.left || this.proximity.right;
				}
			}
		})
	}

	renderClass(test, className) {
		if (test) {
			this.divReference.classList.add(className);
		} else {
			this.divReference.classList.remove(className);
		}
	}

	render() {

		this.divReference.style.left = `${this.actualPos.left}px`;
		this.divReference.style.top = `${this.actualPos.top}px`;

		this.renderClass(this.proximity.top, "proximity-div-top");
		this.renderClass(this.proximity.bottom, "proximity-div-bottom");
		this.renderClass(this.proximity.left, "proximity-div-left");
		this.renderClass(this.proximity.right, "proximity-div-right");
	}
}