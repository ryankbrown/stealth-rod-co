import { Interaction_ParallaxLayer, Interaction_ParallaxContainer } from "./interaction_parallax-stack-gsap.js";

export default class Interaction_RodHeaders_Parallax {
	constructor(app, header_el, header_idx) {
		this.app = app;
		this.rod_header_el = header_el;
		this.header_idx = header_idx;

		this.flipped = this.rod_header_el.getAttribute('data-wf--sr-comp__rod-header--variant') === 'image-flipped';
		this.img_shadow = this.rod_header_el.querySelector('.rod__header-img-shadow');

		
		const shadow_layer = new Interaction_ParallaxLayer({
			layer_el: this.img_shadow,
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
				dir_mod: { x: this.flipped ? 1 : -1, y: -1 },
			},
		});

		
		
		this.parallax_container = new Interaction_ParallaxContainer({
			app: this.app,
			layer_items: [shadow_layer],
			container_el: this.rod_header_el,
			container_id: `rod-header-${this.header_idx}`,
			update_loop: this.app.update_loop,
			relative_el: this.rod_header_el,
		});
	}
	
	destroy() {
		if (this.parallax_container) {
			this.parallax_container.destroy();
			this.parallax_container = null;
		}
	}
}
