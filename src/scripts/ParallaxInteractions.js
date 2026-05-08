import { lerp, clamp } from "../utils/utils.js";

/* ParallaxLayer - Individual layer within a parallax container */
class ParallaxLayer {
	constructor(el, idx) {
		this.idx = idx;
		this.el = el;
		this.tX = 0;
		this.tY = 0;

		// Parse and validate data attributes with defaults
		this.maxOffsetX = parseFloat(this.el.getAttribute("data-parallax-max-x")); // NaN if not set
		this.maxOffsetY = parseFloat(this.el.getAttribute("data-parallax-max-y")); // NaN if not set
		this.moveRateX =
			parseFloat(this.el.getAttribute("data-parallax-rate-x")) || 0.1;
		this.moveRateY =
			parseFloat(this.el.getAttribute("data-parallax-rate-y")) || 0.1;

		// Clamp lerp amount between 0 and 1, default to 0.1 for smooth motion
		const lerpValue = parseFloat(this.el.getAttribute("data-parallax-lerp"));
		this.lerpAmt = isNaN(lerpValue) ? 0.1 : clamp(lerpValue, 0, 1);
	}
	/* Move the layer based on input position */
	
	updateLayer(input) {
		
		let x_move = input.x * this.moveRateX;
		let y_move = input.y * this.moveRateY;

		// Apply max offset limits if defined
		if (!isNaN(this.maxOffsetX)) {
			x_move = clamp(x_move, -this.maxOffsetX, this.maxOffsetX);
		}
		if (!isNaN(this.maxOffsetY)) {
			y_move = clamp(y_move, -this.maxOffsetY, this.maxOffsetY);
		}

		this.tX = lerp(this.tX, x_move, 0.1);
		this.tY = lerp(this.tY, y_move, 0.1);

		this.el.style.setProperty("--tX", `${this.tX}px`);
		this.el.style.setProperty("--tY", `${this.tY}px`);
	}
	/**
	 * Reset layer to center position
	 */
	reset() {
		this.tX = 0;
		this.tY = 0;
		this.el.style.setProperty("--tX", "0px");
		this.el.style.setProperty("--tY", "0px");
	}
}

class ParallaxContainer {
	constructor(container_el, id, options = {}) {
		this.id = id;
		this.container_el = container_el;
		this.layer_items = [];
		this.hover_move = this.container_el.getAttribute("data-parallax-hover") === "true";

		// Hover Target Setup - Setup of the intended target selector and fallback
		this.hover_el = this.container_el.getAttribute("data-parallax-hover-target")
			? this.container_el.closest(
					this.container_el.getAttribute("data-parallax-hover-target"),
				)
			: this.container_el;

		this.isInView = false;
		this.isHovered = false;
		this.isPaused = false;

		this.hoverTimeout = null; // property for hover delay setTimeout function
		this.hoverDelay = 250; // ms delay before parallax activates on hover

		// Setup
		this.setup();

		// Auto-register if options provided
		if (options.updateLoop && options.getInput) {
			this.registerUpdateLoop(options.updateLoop, options.getInput);
		}
	}

	setup() {
		
		// Intersection Observer - Setup the intersection observer to detect if the container is in view
		this.setupIntersectionObserver();

		// Hover Target Listeners - Setup the hover listeners to detect if the container is hovered
		if (this.hover_move) {
			this.setupHoverListeners();
		}
		// Setup Parallax Layers - Setup the layers to move
		const layers = this.container_el.querySelectorAll("[data-parallax-layer]");

		for (let i = 0; i < layers.length; i++) {
			this.layer_items.push(new ParallaxLayer(layers[i], i));
		}
	}

	setupIntersectionObserver() {
		// Only run parallax when container is visible in viewport
		const observer = new IntersectionObserver(
			([entry]) => {
				this.isInView = entry.isIntersecting;
			},
			{
				threshold: 0, // Trigger as soon as any part is visible
				rootMargin: "50px", // Start slightly before entering viewport
			},
		);
		observer.observe(this.container_el);
		this.observer = observer;
	}

	setupHoverListeners() {
		// Only move parallax when hovered (if hover mode is enabled)
		// Use pointer events for better cross-device support (mouse, touch, pen)
		// Use hover_el (may be parent) to avoid button overlay blocking events

		this.handlePointerEnter = (e) => {
			// Clear any existing timeout (in case of rapid re-entry)
			if (this.hoverTimeout) {
				clearTimeout(this.hoverTimeout);
			}

			// Set timeout to activate parallax after delay
			this.hoverTimeout = setTimeout(() => {
				this.isHovered = true;
				this.hoverTimeout = null;
			}, this.hoverDelay);
		};

		this.handlePointerLeave = (e) => {
			// Clear timeout if leaving before activation
			if (this.hoverTimeout) {
				clearTimeout(this.hoverTimeout);
				this.hoverTimeout = null;
			}
			// Immediately deactivate parallax
			this.isHovered = false;
		};

		this.hover_el.addEventListener("pointerenter", this.handlePointerEnter);
		this.hover_el.addEventListener("pointerleave", this.handlePointerLeave);
	}

	registerUpdateLoop(updateLoop, getInput) {
		// Check if the update loop and getInput are provided. if not, return the instance
		if (!updateLoop || !getInput) return this;

		// Create the update function that calls getInput each frame
		this.updateFunction = () => {
			this.input = getInput();

			// Stop if not in view or paused
			if (this.isInView || !this.isPaused) {
				this.moveLayers();
			};
		};
		// Register it with the update loop
		updateLoop.loop_functions.push(this.updateFunction);
		// Store reference for cleanup
		this.update_loop = updateLoop;
		return this; // Allow chaining
	}

	moveLayers() {
		// If hover mode and not hovered, reset to center (0,0), otherwise use current input
		const move_coords = (this.hover_move && !this.isHovered) 
			? { x: 0, y: 0 }
			: this.input;
		
		// Update all layers with the determined coordinates
		for (let layer of this.layer_items) {
			layer.updateLayer(move_coords); 
		}
	}

	// Pause
	pause() {
		this.isPaused = true;
		return this;
	}

	// Resume
	resume() {
		this.isPaused = false;
		return this;
	}

	// Reset layers to center position
	resetLayers() {
		for (let layer of this.layer_items) {
			layer.reset();
		}
	}

	// Destroy
	destroy() {
		// Clean up update loop
		if (this.update_loop && this.updateFunction) {
			// Find and remove the update function from the update loop
			const index = this.update_loop.loop_functions.indexOf(
				this.updateFunction,
			);
			if (index > -1) {
				this.update_loop.loop_functions.splice(index, 1);
			}
		}
		// Clean up observer
		if (this.observer) {
			this.observer.disconnect();
		}
		// Clean up hover timeout
		if (this.hoverTimeout) {
			clearTimeout(this.hoverTimeout);
			this.hoverTimeout = null;
		}
		// Clean up hover event listeners
		if (this.hover_move && this.handlePointerEnter && this.handlePointerLeave) {
			this.hover_el.removeEventListener(
				"pointerenter",
				this.handlePointerEnter,
			);
			this.hover_el.removeEventListener(
				"pointerleave",
				this.handlePointerLeave,
			);
		}
		// Clear layer items
		this.layer_items = [];
		return this; // Method chaining
	}
}

export { ParallaxContainer, ParallaxLayer };
