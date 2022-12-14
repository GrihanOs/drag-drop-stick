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
			DivWrapper.draggedDiv.logicalPos = {...DivWrapper.draggedDiv.actualPos};
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
		} else if (newLeft <= SCREEN_BEZEL) {
			this.actualPos.left = SCREEN_BEZEL;
		} else if (newLeft + this.logicalPos.width >= window.visualViewport.width - SCREEN_BEZEL) {
			this.actualPos.left = window.visualViewport.width - SCREEN_BEZEL - this.logicalPos.width;
		}

		this.logicalPos.top = newTop;

		if (newTop > SCREEN_BEZEL && newTop + this.logicalPos.height < window.visualViewport.height - SCREEN_BEZEL) {
			this.actualPos.top = newTop;
		} else if (newTop <= SCREEN_BEZEL) {
			this.actualPos.top = SCREEN_BEZEL;
		} else if (newTop + this.logicalPos.height >= window.visualViewport.height - SCREEN_BEZEL) {
			this.actualPos.top = window.visualViewport.height - SCREEN_BEZEL - this.logicalPos.height;
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

				// Detect intersection between elements.
				const intersectsVertical = ((logicalTop >= divWrapper.top && logicalTop <= divWrapper.bottom) || 
					(divWrapper.top >= logicalTop && divWrapper.top <= logicalBottom));
				const intersectsHotizontal = ((logicalLeft >= divWrapper.left && logicalLeft <= divWrapper.right) || 
					(divWrapper.left >= logicalLeft && divWrapper.left <= logicalRight));

				// Detect vertical proximity.
				const topClose = ((!this.proximity.vertical && logicalTop - divWrapper.bottom > -PROX_DISTANCE) && 
					(logicalTop - divWrapper.bottom <= PROX_DISTANCE));
				const bottomClose = ((!this.proximity.vertical && divWrapper.top - logicalBottom > -PROX_DISTANCE) && 
					(divWrapper.top - logicalBottom <= PROX_DISTANCE));

				// Detect horizontal proximity.
				const leftClose = ((!this.proximity.horizontal && logicalLeft - divWrapper.right > -PROX_DISTANCE) && 
					(logicalLeft - divWrapper.right <= PROX_DISTANCE));
				const rightClose = ((!this.proximity.horizontal && divWrapper.left - logicalRight > -PROX_DISTANCE) && 
					(divWrapper.left - logicalRight <= PROX_DISTANCE));

				// Check for vertical snap:
				// Horizontal intersect, and vertical proximity.
				if (intersectsHotizontal) {
					if (!this.proximity.vertical && topClose) {
						this.proximity.top = true;
						this.actualPos.top -= logicalTop - divWrapper.bottom;
					}

					if (!this.proximity.vertical & bottomClose) {
						this.proximity.bottom = true;
						this.actualPos.top += divWrapper.top - logicalBottom;
					}
				}

				// Check for horizontal snap:
				// Vertical intersect, and horizontal proximity.
				if (intersectsVertical) {
					if (!this.proximity.horizontal && leftClose) {
						this.proximity.left = true;
						this.actualPos.left -= logicalLeft - divWrapper.right;
					}
					if (!this.proximity.horizontal && rightClose) {
						this.proximity.right = true;
						this.actualPos.left += divWrapper.left - logicalRight;
					}
				}

				// Check for corner snap if no side snap and no intersect detect.
				if (!(this.proximity.top || this.proximity.bottom || this.proximity.left || this.proximity.right) && 
					!(intersectsVertical || intersectsHotizontal) && 
					!(this.proximity.vertical || this.proximity.horizontal)) {

					if (leftClose && topClose) {
						this.proximity.top = true;
						this.actualPos.top -= logicalTop - divWrapper.bottom;
						this.proximity.left = true;
						this.actualPos.left -= logicalLeft - divWrapper.right;
					} else if (leftClose && bottomClose) {
						this.proximity.bottom = true;
						this.actualPos.top += divWrapper.top - logicalBottom;
						this.proximity.left = true;
						this.actualPos.left -= logicalLeft - divWrapper.right;
					} else if (rightClose && topClose) {
						this.proximity.top = true;
						this.actualPos.top -= logicalTop - divWrapper.bottom;
						this.proximity.right = true;
						this.actualPos.left += divWrapper.left - logicalRight;
					} else if (rightClose && bottomClose) {
						this.proximity.bottom = true;
						this.actualPos.top += divWrapper.top - logicalBottom;
						this.proximity.right = true;
						this.actualPos.left += divWrapper.left - logicalRight;
					}

				}

				// Check every direction (vertical/horizontal) only until the first detection.
				this.proximity.vertical = this.proximity.top || this.proximity.bottom;
				this.proximity.horizontal = this.proximity.left || this.proximity.right;
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