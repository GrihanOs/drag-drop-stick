const SPEED = 5;

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

	divActivated() {
		DivWrapper.activeDiv.intersects = false;
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

		this.intersectionTest();

		this.logicalPos.left = newLeft;
		this.logicalPos.top = newTop;

	}

	intersectionTest() {

		this.intersects = false;

		DivWrapper.allDivWrappers.forEach((divWrapper) => {

			if (divWrapper.id !== this.id) {

				this.intersects = this.intersects ||
					(((this.top >= divWrapper.top && this.top <= divWrapper.bottom) ||
					  (divWrapper.top >= this.top && divWrapper.top <= this.bottom)) &&
					 ((this.left >= divWrapper.left && this.left <= divWrapper.right) ||
					  (divWrapper.left >= this.left && divWrapper.left <= this.right)));
			}
		})

	}

	render() {

		this.divReference.style.left = `${this.actualPos.left}px`;
		this.divReference.style.top = `${this.actualPos.top}px`;

		if (this.intersects) {
			this.divReference.classList.add("intersected-div");
		} else {
			this.divReference.classList.remove("intersected-div");
		}
	}
}