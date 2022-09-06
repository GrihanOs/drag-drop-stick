const SPEED = 5;

export class DivWrapper {
	constructor(divReference) {

		this.divReference = divReference;
		this.actualPos = this.divReference.getBoundingClientRect();
		this.logicalPos = this.divReference.getBoundingClientRect();

		this.selectorInput = divReference.querySelector(".movable-div-selector");

		this.divActivatedListener = this.divActivated.bind(this);
		this.selectorInput.addEventListener("change", this.divActivatedListener);
	}

	divActivated(event) {
		console.log(this.divReference.id);
	}

	move() {

	}
}