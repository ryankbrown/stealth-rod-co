import { Interaction_ParallaxLayer, Interaction_ParallaxContainer } from "./interaction_parallax-stack-gsap.js";

export default class Interaction_HighlightCircle {
	constructor(app, highlight_circle, highlight_circle_container, highlight_circle_idx) {
		this.app = app;
		this.highlight_circle = typeof highlight_circle === 'string' ? document.querySelector(highlight_circle) : highlight_circle;
		this.highlight_circle_container = typeof highlight_circle_container === 'string' ? document.querySelector(highlight_circle_container) : highlight_circle_container;
		this.highlight_circle_idx = highlight_circle_idx;
		this.id = `highlight-circle--${this.highlight_circle_idx}`;
		
		const circle_layer = new Interaction_ParallaxLayer({
			layer_el: this.highlight_circle,
			options: {
				lerp_amt: 0.05,
				move_rate: { x: 1, y: 1 },
				clamp_offset: 'none',
				// Opposite-to-pointer by default, with X flipped for mirrored variant.
				dir_mod: { x: 1, y: 1 },
			},
		});
		
		// Intersection + pointer math need a container; fall back if Webflow omits the data attr.
		const container_el =
			this.highlight_circle_container ?? this.highlight_circle.parentElement;

		this.parallax_container = new Interaction_ParallaxContainer({
			app: this.app,
			layer_items: [circle_layer],
			container_el,
			container_id: this.id,
			update_loop: this.app.update_loop,
			relative_input: 'viewport',
		});
	}

	pause() {
		if (this.parallax_container) this.parallax_container.pause();
		return this;
	}

	resume() {
		if (this.parallax_container) this.parallax_container.resume();
		return this;
	}
	
	destroy() {
		if (this.parallax_container) {
			this.parallax_container.destroy();
			this.parallax_container = null;
		}
	}
}
