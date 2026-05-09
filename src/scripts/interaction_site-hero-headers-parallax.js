import { Interaction_ParallaxLayer, Interaction_ParallaxContainer } from "./interaction_parallax-stack-gsap.js";

export default class Interaction_SiteHeroHeaders_Parallax {
	constructor(app, header_el, header_idx) {
		this.app = app;
		this.header_el = header_el;
		this.header_idx = header_idx;
		
		// BG Image Layer
		this.bg_img_layer = new Interaction_ParallaxLayer({
			layer_el: '.global__hero-img',
			options: {
				lerp_amt: 0.01,
				move_rate: { x: 0.035, y: 0.035 },
				clamp_offset: {
					min_x: -50,
					max_x: 50,
					min_y: -50,
					max_y: 50,
				},
				dir_mod: { x: -1, y: -1 }
			}
		});

		this.parallax_container = new Interaction_ParallaxContainer({
			app: this.app,
			layer_items: [ this.bg_img_layer ],
			container_el: this.header_el,
			container_id: `site-header--${document.body.dataset.pg}`,
			update_loop: this.app.update_loop,
			relative_el: this.header_el.querySelector('.global__hero-element-stack')
		});
	}
	
	destroy() {
		if (this.parallax_container) {
			this.parallax_container.destroy();
			this.parallax_container = null;
		}
	}
}
