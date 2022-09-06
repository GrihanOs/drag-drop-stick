const SPEED = 5;

export class DivWrapper {

	static activeDiv = null;

	constructor(divReference) {

		this.divReference = divReference;
		this.actualPos = Object.assign({}, this.divReference.getBoundingClientRect());
		this.logicalPos = Object.assign({}, this.divReference.getBoundingClientRect());

		this.selectorInput = divReference.querySelector(".movable-div-selector");

		this.divActivatedListener = this.divActivated.bind(this);
		this.selectorInput.addEventListener("change", this.divActivatedListener);

		DivWrapper.activeDiv = DivWrapper.activeDiv || this;
	}

	get id() {
		return this.divReference.id;
	}

	divActivated() {
		DivWrapper.activeDiv = this;
	}

	move(verticalMoveDiff, horizontalMoveDiff) {

		const clientRect = this.divReference.getBoundingClientRect();

		const newLeft = clientRect.left + horizontalMoveDiff * SPEED;
		const newTop = clientRect.top + verticalMoveDiff * SPEED;

		this.actualPos.left = newLeft;
		this.actualPos.top = newTop;

		this.logicalPos.left = newLeft;
		this.logicalPos.top = newTop;
	}

	render() {

		this.divReference.style.left = `${this.actualPos.left}px`;
		this.divReference.style.top = `${this.actualPos.top}px`;

	}
}