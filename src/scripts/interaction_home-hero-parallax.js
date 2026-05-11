import { Interaction_ParallaxLayer, Interaction_ParallaxContainer } from "./interaction_parallax-stack-gsap.js";

export default class Interaction_HomeHero_Parallax {
	constructor(app) {
		this.app = app;
		this.header_el = document.querySelector('.home__hero-section');
		
		
		const lerp_amt = 0.025;
		
		// BG Image Layer
		this.bg_img_layer = new Interaction_ParallaxLayer({
			layer_el: '.home__hero-img--sky',
			options: {
				lerp_amt: lerp_amt,
				move_rate: { x: 0.15, y: 0 },
				clamp_offset: {
					min_x: -100,
					max_x: 100,
					min_y: -50,
					max_y: 50,
				},
				dir_mod: { x: 1, y: 1 }
			}
		});
		
		this.fisherman_img_layer = new Interaction_ParallaxLayer({
			layer_el: '.home__hero-img--fisherman',
			options: {
				lerp_amt: lerp_amt,
				move_rate: { x: 0.05, y: 0 },
				clamp_offset: {
					min_x: -100,
					max_x: 100,
					min_y: -50,
					max_y: 50,
				},
				dir_mod: { x: 1, y: 1 }
			}
		});
		

		this.parallax_container = new Interaction_ParallaxContainer({
				app: this.app,
				layer_items: [ 
					this.bg_img_layer, 
					this.fisherman_img_layer
				],
				container_el: this.header_el,
				container_id: `home-hero-header`,
				update_loop: this.app.update_loop,
				relative_el: this.header_el.querySelector('.home__hero-element-stack')
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
