const SPEED = 2;
const PROX_DISTANCE = 25;
const SCREEN_BEZEL = 10;

export class DivWrapper {

	static activeDiv = null;
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
		this.selectorInput.addEventListener("change", this.divActivatedListener);

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

					if (!this.proximity.vertical) {
						if (logicalTop - divWrapper.bottom > -PROX_DISTANCE && logicalTop - divWrapper.bottom <= PROX_DISTANCE) {
							this.proximity.top = true;
							this.actualPos.top -= logicalTop - divWrapper.bottom;
						}
					}

					if (!this.proximity.vertical) {
						if (divWrapper.top - logicalBottom > -PROX_DISTANCE && divWrapper.top - logicalBottom <= PROX_DISTANCE) {
							this.proximity.bottom = true;
							this.actualPos.top += divWrapper.top - logicalBottom;
						}
					}



					this.proximity.top = this.proximity.top || logicalTop - divWrapper.bottom > 0 && logicalTop - divWrapper.bottom <= PROX_DISTANCE;
					this.proximity.bottom = this.proximity.bottom || divWrapper.top - logicalBottom > 0 && divWrapper.top - logicalBottom <= PROX_DISTANCE;

				}

				if (intersectsVertical) {

					this.proximity.left = this.proximity.left || logicalLeft - divWrapper.right > 0 && logicalLeft - divWrapper.right <= PROX_DISTANCE;
					this.proximity.right = this.proximity.right || divWrapper.left - logicalRight > 0 && divWrapper.left - logicalRight <= PROX_DISTANCE;

					if (!this.proximity.horizontal) {
						if (logicalLeft - divWrapper.right > -PROX_DISTANCE && logicalLeft - divWrapper.right <= PROX_DISTANCE) {
							this.proximity.left = true;
							this.actualPos.left -= logicalLeft - divWrapper.right;
						}
					}

					if (!this.proximity.horizontal) {
						if (divWrapper.left - logicalRight > -PROX_DISTANCE && divWrapper.left - logicalRight <= PROX_DISTANCE) {
							this.proximity.right = true;
							this.actualPos.left += divWrapper.left - logicalRight;
						}
					}
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