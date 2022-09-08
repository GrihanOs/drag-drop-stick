const SPEED = 1;
const PROX_DISTANCE = 100;

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
		}

	}

	divActivated() {
		DivWrapper.activeDiv.resetProximity();
		DivWrapper.activeDiv.render();
		DivWrapper.activeDiv = this;
		this.selectorInput.blur();
	}

	move(verticalMoveDiff, horizontalMoveDiff) {

		const clientRect = this.divReference.getBoundingClientRect();

		const newLeft = clientRect.left + horizontalMoveDiff * SPEED;
		const newTop = clientRect.top + verticalMoveDiff * SPEED;

		this.actualPos.left = newLeft;
		this.actualPos.top = newTop;

		this.proximityTest();

		this.logicalPos.left = newLeft;
		this.logicalPos.top = newTop;

	}

	proximityTest() {

		this.resetProximity();

		DivWrapper.allDivWrappers.forEach((divWrapper) => {

			if (divWrapper.id !== this.id) {

				const intersectsHotizontal = ((this.left >= divWrapper.left && this.left <= divWrapper.right) || (divWrapper.left >= this.left && divWrapper.left <= this.right));
				const intersectsVertical = ((this.top >= divWrapper.top && this.top <= divWrapper.bottom) || (divWrapper.top >= this.top && divWrapper.top <= this.bottom));

				if (intersectsHotizontal) {

					this.proximity.top = this.proximity.top || this.top - divWrapper.bottom > 0 && this.top - divWrapper.bottom <= PROX_DISTANCE;
					this.proximity.bottom = this.proximity.bottom || divWrapper.top - this.bottom > 0 && divWrapper.top - this.bottom <= PROX_DISTANCE;

				}

				if (intersectsVertical) {

					this.proximity.left = this.proximity.left || this.left - divWrapper.right > 0 && this.left - divWrapper.right <= PROX_DISTANCE;
					this.proximity.right = this.proximity.right || divWrapper.left - this.right > 0 && divWrapper.left - this.right <= PROX_DISTANCE;

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