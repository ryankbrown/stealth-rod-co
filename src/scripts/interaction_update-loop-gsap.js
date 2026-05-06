export default class Interaction_UpdateLoop_GSAP {
	constructor(lag_smoothing=true) {
		this.loop_functions = [];
		this.isRunning = false;
		this.timestamp = 0;  // ms since page load
		this.deltaTime = 0;  // seconds since last frame
		this.tick = this.tick.bind(this);
		this.create();
		this.lag_smoothing = lag_smoothing; // disable lag catch-up after tab refocus
	}

	// GSAP hands us time (seconds), deltaTime (ms), frame (int)
	// We normalize to match your original API:
	// - this.timestamp in ms (multiply time by 1000)
	// - this.deltaTime in seconds (divide deltaTime by 1000)
	tick(time, deltaTime) {
		if (!this.isRunning) return;

		this.timestamp = time * 1000;
		this.deltaTime = deltaTime / 1000;

		for (let loop_function of this.loop_functions) {
			loop_function();
		}
	}

	create() {
		this.isRunning = true;
		gsap.ticker.add(this.tick);
		
		if (!this.lag_smoothing) {
			gsap.ticker.lagSmoothing(0); // disable lag catch-up after tab refocus
		}
	}

	destroy() {
		this.isRunning = false;
		gsap.ticker.remove(this.tick);
		this.loop_functions = [];
		this.timestamp = 0;
		this.deltaTime = 0;
	}
}