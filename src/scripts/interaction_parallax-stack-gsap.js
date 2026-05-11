export class Interaction_ParallaxLayer {
	constructor({
		app,
		layer_el,
		layer_id,
		options = {},
	}) {
		this.app = app;
		// string selector or node
		this.layer_el = typeof layer_el === 'string' ? document.querySelector(layer_el) : layer_el;
		this.layer_id = layer_id;
		if (!this.layer_el) {
			throw new Error(`Layer element not found: ${layer_el}`);
		};
		
		const {
			lerp_amt = 0.1,
			move_rate = { x: 0.1, y: 0.1 },
			clamp_offset = {
				min_x: -100,
				max_x: 100,
				min_y: -100,
				max_y: 100,
			},
			dir_mod = { x: 1, y: 1 },
		} = options;

		this.lerp_amt = lerp_amt;
		this.move_rate = move_rate;
		this.clamp_offset = clamp_offset;
		this.dir_mod = dir_mod;

		this.trans_pos = { x: 0, y: 0 };	
		
	}
	
	
	updateLayer(input) {
		
		let x_move = input.x * this.move_rate.x * this.dir_mod.x;
		let y_move = input.y * this.move_rate.y * this.dir_mod.y;
		
		// Apply max offset limits if defined
		x_move = gsap.utils.clamp( this.clamp_offset.min_x, this.clamp_offset.max_x, x_move);
		y_move = gsap.utils.clamp( this.clamp_offset.min_y, this.clamp_offset.max_y, y_move);
		
		this.trans_pos.x = gsap.utils.interpolate(this.trans_pos.x, x_move, this.lerp_amt);
		this.trans_pos.y = gsap.utils.interpolate(this.trans_pos.y, y_move, this.lerp_amt);

		this.layer_el.style.setProperty("--tX", `${ this.trans_pos.x }px`);
		this.layer_el.style.setProperty("--tY", `${ this.trans_pos.y }px`);

	}
	/**
	 * Reset layer to center position
	 */
	reset() {
		this.trans_pos.x = 0;
		this.trans_pos.y = 0;
		this.layer_el.style.setProperty("--tX", "0px");
		this.layer_el.style.setProperty("--tY", "0px");
	}
}




export class Interaction_ParallaxContainer {
	constructor({
		app,
		layer_items = [],
		container_el,
		container_id,
		update_loop,
		move_input = { x: 0, y: 0 },
		relative_el = null,
		hover_el = false,
		hover_delay = 250,
	}) {
		this.app = app;
		this.update_loop = update_loop;
		
		this.container_id = container_id;
		this.container_el = container_el;
		this.layer_items = layer_items;
		
		// State Opts
		this.is_in_view = false;
		this.is_paused = false;
		
		// Hover Opts
		this.hover_el = hover_el;
		this.hover_mode_enabled = hover_el ? true : false;
		this.hover_delay = hover_delay;
		this.is_hovered = false;
		this.hover_timeout = null; // property for hover delay setTimeout function
		this.move_input = move_input;
		this.relative_el = relative_el;
		this._destroyed = false;

		// Exit gracefully if no layer items are provided
		if (!Array.isArray(layer_items) || layer_items.length === 0) {
			console.warn(`[Parallax] No layers provided for container: ${container_id}. Parallax will be disabled for this container.`);
			return;
		}
		
		// Setup
		this.setup();
	}

	setup() {
		
		// Intersection Observer - Setup the intersection observer to detect if the container is in view
		this.setupIntersectionObserver();

		// Hover Target Listeners - Setup the hover listeners to detect if the container is hovered
		if (this.hover_mode_enabled) { 
			this.setupHoverListeners(); 
		}
		this.parallaxMovement();	
	}
	
	parallaxMovement() {
		this.layer_items.forEach((layer, index) => {
			layer.app = this.app;
			layer.layer_idx = index;
		});
		
		this.updateFunction = ()=> {
			if (!this.is_in_view || this.is_paused) return;
			
			// Resolve the input based on if a relative element is provided
			let resolved_input = this.move_input;
			if (this.relative_el) {
				resolved_input = this.app.pointer_tracker.rel_cent(this.relative_el);
			}

			let move_coords;
			// If hover mode is enabled and not hovered, reset to center (0,0), otherwise use current input
			if (this.hover_mode_enabled && !this.is_hovered) {
				move_coords = { x: 0, y: 0 };
			} 
			// Otherwise use current input
			else {
				move_coords = resolved_input;
			}

			for (let layer of this.layer_items) {
				layer.updateLayer(move_coords);
			}
		};
		this.update_loop.loop_functions.push(this.updateFunction);
	}
	
	setupIntersectionObserver() {
		if (!this.container_el) {
			console.warn(`[Parallax] No container_el for ${this.container_id}; intersection observer skipped.`);
			return;
		}
		// Only run parallax when container is visible in viewport (root = viewport)
		const observer = new IntersectionObserver(
			(entries) => {
				if (this._destroyed) return;
				const entry = entries[0];
				if (!entry) return;
				this.is_in_view = entry.isIntersecting;
			},
			{
				threshold: 0, // any pixel counts
				rootMargin: "50px", // begin slightly before entering viewport
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
			if (this.hover_timeout) {
				clearTimeout(this.hover_timeout);
			}

			// Set timeout to activate parallax after delay
			this.hover_timeout = setTimeout(() => {
				this.is_hovered = true;
				this.hover_timeout = null;
			}, this.hover_delay);
		};

		this.handlePointerLeave = (e) => {
			// Clear timeout if leaving before activation
			if (this.hover_timeout) {
				clearTimeout(this.hover_timeout);
				this.hover_timeout = null;
			}
			// Immediately deactivate parallax
			this.is_hovered = false;
		};

		this.hover_el.addEventListener("pointerenter", this.handlePointerEnter);
		this.hover_el.addEventListener("pointerleave", this.handlePointerLeave);
	}

	// Pause
	pause() {
		if (this._destroyed) return this;
		this.is_paused = true;
		return this;
	}

	// Resume
	resume() {
		if (this._destroyed) return this;
		this.is_paused = false;
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
		this._destroyed = true;
		this.is_paused = true;

		// Remove update callback from shared app loop
		if (this.update_loop && this.updateFunction) {
			const index = this.update_loop.loop_functions.indexOf(this.updateFunction);
			if (index > -1) {
				this.update_loop.loop_functions.splice(index, 1);
			}
		}

		// Disconnect IntersectionObserver
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}

		// Clear pending hover activation timer
		if (this.hover_timeout) {
			clearTimeout(this.hover_timeout);
			this.hover_timeout = null;
		}

		// Remove hover listeners when hover mode is enabled
		if (
			this.hover_mode_enabled &&
			this.hover_el &&
			this.handlePointerEnter &&
			this.handlePointerLeave
		) {
			this.hover_el.removeEventListener("pointerenter", this.handlePointerEnter);
			this.hover_el.removeEventListener("pointerleave", this.handlePointerLeave);
		}

		// Reset state/references to avoid stale reuse
		this.handlePointerEnter = null;
		this.handlePointerLeave = null;
		this.updateFunction = null;
		this.layer_items = [];
		this.is_hovered = false;
		this.is_in_view = false;
		return this;
	}
}
