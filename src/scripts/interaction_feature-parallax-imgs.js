import { Interaction_ParallaxLayer, Interaction_ParallaxContainer } from "./interaction_parallax-stack-gsap.js";

export default class Interaction_FeatureParallaxImgs {
	constructor(app, img_container) {
		this.app = app;
		this.img_container = typeof img_container === 'string' ? document.querySelector(img_container) : img_container;
		this.img = this.img_container.querySelector('.our-rods__ftr-img');
		this.id = this.img_container.classList[1];
		
		const img_layer = new Interaction_ParallaxLayer({
			layer_el: this.img,
			options: {
				lerp_amt: 0.05,
				move_rate: { x: 0.05, y: 0.075 },
				clamp_offset: {
					min_x: -100,
					max_x: 100,
					min_y: -100,
					max_y: 100,
				},
				// Opposite-to-pointer by default, with X flipped for mirrored variant.
				dir_mod: { x: 1, y: 1 },
			},
		});
		
		

		this.parallax_container = new Interaction_ParallaxContainer({
			app: this.app,
			layer_items: [img_layer],
			container_el: this.img_container,
			container_id: this.id,
			update_loop: this.app.update_loop,
			// WHERE = container center (default would be hover_el / image center)
			relative_input: this.img_container,
			hover_el: this.img,
		});
		
		// console.log(this.parallax_container);
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
