class PointerTracker {
	constructor() {
		// Current position
		this.pos = { x: 0, y: 0 };
		
		// Previous position (for velocity/distance calculations)
		this.prevPos = { x: 0, y: 0 };
		
		// Velocity in pixels per second
		this.velocity = { x: 0, y: 0 };
		
		// Speed (magnitude of velocity)
		this.speed = 0;
		
		// Distance moved since last update
		this.distance = 0;
		
		// Timestamp for velocity calculations
		this.timestamp = performance.now();
		
		// Store handler reference so it can be properly removed
		this.handler = (e) => {
			// Store previous position
			this.prevPos.x = this.pos.x;
			this.prevPos.y = this.pos.y;
			
			// Update current position
			this.pos.x = e.clientX;
			this.pos.y = e.clientY;
			
			// Calculate time delta
			const now = performance.now();
			const dt = (now - this.timestamp) / 1000; // Convert to seconds
			this.timestamp = now;
			
			// Calculate deltas
			const dx = this.pos.x - this.prevPos.x;
			const dy = this.pos.y - this.prevPos.y;
			
			// Calculate velocity (px/s)
			// Add safety check to prevent division by zero or infinity on first move
			if (dt > 0 && dt < 1) { // Reasonable time delta (less than 1 second)
				this.velocity.x = dx / dt;
				this.velocity.y = dy / dt;
			}
			
			// Calculate distance moved this frame
			this.distance = Math.sqrt(dx * dx + dy * dy);
			
			// Calculate speed (magnitude of velocity vector)
			this.speed = Math.sqrt(
				this.velocity.x * this.velocity.x + 
				this.velocity.y * this.velocity.y
			);
		};

		// Create event listener
		window.addEventListener('pointermove', this.handler);
	}

	// Clean up event listener
	destroy() {
		window.removeEventListener('pointermove', this.handler);
	}

	// Normalized relative to top-left corner of window (0-1 range)
	get norm() {
		return {
			x: this.pos.x / window.innerWidth,
			y: this.pos.y / window.innerHeight
		};
	}

	// Position relative to center of window
	get cent() {
		return {
			x: this.pos.x - window.innerWidth / 2,
			y: this.pos.y - window.innerHeight / 2
		};
	}

	// Normalized relative to center of window (-0.5 to 0.5 range)
	get cent_norm() {
		const cent = this.cent;
		return {
			x: cent.x / window.innerWidth,
			y: cent.y / window.innerHeight
		};
	}

	// Get position relative to an element
	rel_pos(el) {
		const rect = el.getBoundingClientRect();
		return {
			x: this.pos.x - rect.left,
			y: this.pos.y - rect.top
		};
	}

	// Get normalized position relative to an element (0-1 range)
	rel_pos_norm(el) {
		const rect = el.getBoundingClientRect();
		const relPos = this.rel_pos(el);
		return {
			x: relPos.x / rect.width,
			y: relPos.y / rect.height
		};
	}

	// Get centered position relative to an element
	rel_cent(el) {
		const rect = el.getBoundingClientRect();
		return {
			x: this.pos.x - (rect.left + rect.width / 2),
			y: this.pos.y - (rect.top + rect.height / 2)
		};
	}

	// Get normalized centered position relative to an element (-0.5 to 0.5 range)
	rel_cent_norm(el) {
		const rect = el.getBoundingClientRect();
		const relCent = this.rel_cent(el);
		return {
			x: relCent.x / rect.width,
			y: relCent.y / rect.height
		};
	}

	// Convenience getters for common accessors
	get x() {
		return this.pos.x;
	}

	get y() {
		return this.pos.y;
	}
}

export default PointerTracker;
