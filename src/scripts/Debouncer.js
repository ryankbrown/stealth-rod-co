// Debouncer.js
export class Debouncer {
	constructor(defaultDelay = 300) {
		this.defaultDelay = defaultDelay;
		this.timeout = null;
	}

	// Call this each time the event fires
	run(callback, delay = this.defaultDelay) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(callback, delay);
	}

	// Cancel any pending debounced callback
	cancel() {
		clearTimeout(this.timeout);
		this.timeout = null;
	}

	// Check if a debounced callback is currently pending
	isPending() {
		return this.timeout !== null;
	}

	// Cleanup on destroy
	destroy() {
		this.cancel();
	}
}

