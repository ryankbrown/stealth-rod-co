export default class Interaction_UpdateLoop {
	constructor() {
		this.loop_functions = [];
		this.isRunning = false;
		this.animationFrameId = null;
		this.lastTime = 0;
		this.timestamp = 0; // ms since page load
		this.deltaTime = 0; // seconds since last frame
		this.create();
	}

	calculateDeltaTime(timestamp) {
		const deltaTime = this.lastTime ? (timestamp - this.lastTime) / 1000 : 0;
		this.lastTime = timestamp;
		return deltaTime;
	}

	create() {
		this.isRunning = true;
		this.loop = (timestamp) => {
			if (!this.isRunning) return;

			this.timestamp = timestamp;
			this.deltaTime = this.calculateDeltaTime(timestamp);

			for (let loop_function of this.loop_functions) {
				loop_function();
			}

			this.animationFrameId = requestAnimationFrame(this.loop);
		};

		this.animationFrameId = requestAnimationFrame(this.loop);
	}

	destroy() {
		this.isRunning = false;
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.loop_functions = [];
		this.lastTime = 0;
	}
}

