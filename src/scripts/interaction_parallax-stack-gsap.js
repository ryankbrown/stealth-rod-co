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
			move_rate = { x: 1, y: 1 },
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
		if (this.clamp_offset !== 'none' && this.clamp_offset !== null) {
			x_move = gsap.utils.clamp( this.clamp_offset.min_x, this.clamp_offset.max_x, x_move);
			y_move = gsap.utils.clamp( this.clamp_offset.min_y, this.clamp_offset.max_y, y_move);
		}
		
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




export class Interaction_ParallaxStack {
	constructor({
		app,
		layer_items = [],
		container_el,
		container_id,
		update_loop,
		// WHERE — pointer / pin reference (see resolveMoveCoords).
		// 'viewport' | 'viewport-pin' | CSS selector | Element
		// Omit → 'viewport', or hover_el when hover_el is set (pass parent explicitly to override).
		relative_to,
		// Hit target for pointerenter/leave (WHEN). Also used as WHERE when relative_to is omitted.
		hover_el = false,
		hover_delay = 250,
		parallax_min_width_mq = "(min-width: 768px)",
	}) {
		this.app = app;
		this.update_loop = update_loop;
		
		this.container_id = container_id;
		this.container_el = container_el;
		this.layer_items = layer_items;
		this.parallax_min_width_mq = parallax_min_width_mq;
		
		// State Opts
		this.is_in_view = false;
		this.is_paused = false;
		
		// Hover Opts — when to run parallax (hit target)
		this.hover_el = hover_el;
		this.hover_mode_enabled = hover_el ? true : false;
		this.hover_delay = hover_delay;
		this.is_hovered = false;
		this.hover_timeout = null; // property for hover delay setTimeout function
		
		// If relative_to is not set, use hover_el if it is set, otherwise use 'viewport'
		this.relative_to =
			relative_to ??
			(hover_el ? hover_el : 'viewport');

		// If relative_to is not 'viewport' or 'viewport-pin', set relative_el to the element specified by relative_to
		if (
			this.relative_to !== 'viewport' &&
			this.relative_to !== 'viewport-pin'
		) {
			if (typeof this.relative_to === "string") {
				this.relative_el = document.querySelector(this.relative_to);
			} else if (this.relative_to instanceof Element) {
				this.relative_el = this.relative_to;
			} else {
				this.relative_el = null;
			}
		}
		
		this._destroyed = false;

		// Exit gracefully if no layer items are provided
		if (!Array.isArray(layer_items) || layer_items.length === 0) {
			console.warn(`[Parallax] No layers provided for container: ${container_id}. Parallax will be disabled for this container.`);
			return;
		}
		
		this.setupMatchMedia();
	}

	setupMatchMedia() {
		if (this.parallax_min_width_mq === false) {
			this.activate();
			return;
		}

		this.match_media = gsap.matchMedia();
		this.match_media.add(this.parallax_min_width_mq, () => {
			if (this._destroyed) return;
			this.activate();
			return () => this.deactivate();
		});
	}

	/**
	 * Turn parallax on — called when the viewport matches parallax_min_width_mq
	 * (or immediately on init when parallax_min_width_mq is false).
	 * Wires up the intersection observer, hover listeners, and update-loop callback.
	 */
	activate() {
		this.setupIntersectionObserver();

		// Listen on hover_el (hit target), not relative_el
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
			
			const tracker = this.app?.pointer_tracker;
			if (!tracker) return;
			
			for (let layer of this.layer_items) {
				let move_coords;
				// --- WHEN: hover mode + not over hover_el → rest (no pointer follow)
				if (this.hover_mode_enabled && !this.is_hovered) {
					move_coords = { x: 0, y: 0 };
				} else {
					move_coords = this.resolveMoveCoords(layer, tracker);
				}
				if (!move_coords) continue;
				layer.updateLayer(move_coords);
			}
		};
		
		this.update_loop.loop_functions.push(this.updateFunction);
	}

	resolveMoveCoords(layer, tracker) {
		if (this.relative_to === 'viewport-pin') {
			if (!layer?.layer_el) {
				return { x: 0, y: 0 };
			}
			return tracker.vp_pin_translate(
				layer.layer_el,
				tracker.cent,
				layer.trans_pos,
			);
		}

		if (this.relative_to === 'viewport') {
			return tracker.cent;
		}

		if (this.relative_el) {
			return tracker.rel_cent(this.relative_el);
		}

		return { x: 0, y: 0 };
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
			// Imatch_mediaediately deactivate parallax
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

	/**
	 * Turn parallax off — called when the viewport drops below parallax_min_width_mq,
	 * or during final destroy. Removes all runtime wiring and resets layers to center
	 * so a later resize back above the breakpoint can call activate() cleanly again.
	 */
	deactivate() {
		const was_paused = this.is_paused;

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
		this.is_paused = was_paused;

		this.resetLayers();
	}

	/**
	 * Permanently remove this stack — call when the parent interaction is torn down
	 * (e.g. nav close). Unlike deactivate(), which is temporary and reversible on resize,
	 * destroy() marks the instance as dead, reverts matchMedia so it cannot re-activate,
	 * and clears layer references. deactivate() only stops the runtime wiring; destroy()
	 * ends the stack's lifecycle entirely.
	 */
	destroy() {
		if (this._destroyed) return this;
		this._destroyed = true;

		if (this.match_media) {
			this.match_media.revert();
			this.match_media = null;
		} else {
			this.deactivate();
		}

		this.layer_items = [];
		return this;
	}
}
