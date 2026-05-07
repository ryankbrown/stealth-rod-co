export default class Interaction_RodHeaders_Parallax {
	constructor(app, header_el, header_idx) {
		
		this.app = app;
		
		this.rod_header_el = header_el;
		this.header_idx = header_idx;
		
		this.flipped = this.rod_header_el.getAttribute('data-wf--sr-comp__rod-header--variant') === 'image-flipped';
		
		// this.img = this.rod_header_el.querySelector('.rod__header-img');
		this.img_shadow = this.rod_header_el.querySelector('.rod__header-img-shadow');
		// this.heading_container = this.rod_header_el.querySelector('.rod__heading-container');
		
		// Keep transform state between frames so interpolate creates actual smoothing.
		this.img_shadow_x = 0;
		this.img_shadow_y = 10;
		
		
		this.handleRodHeaderParallax = () => {
			
			const pointer = {
				x: this.app.pointer_tracker.rel_cent(this.rod_header_el).x,
				y: this.app.pointer_tracker.rel_cent(this.rod_header_el).y
			}
			
			const interp = gsap.utils.interpolate;
			
			// Opposite to mouse in viewport space. rel_cent is always viewport-anchored.
			const rateX = 0.05;
			const rateY = 0.075;
			
			let move_calc_x = -pointer.x * rateX;
			let move_calc_y = -pointer.y * rateY;
			// Shadow lives under scaleX(-1): local +translateX reads as screen -X, so flip X once.
			if (this.flipped) move_calc_x *= -1;
			
			this.img_shadow_x = interp(this.img_shadow_x, move_calc_x, 0.1);
			this.img_shadow_y = interp(this.img_shadow_y, move_calc_y, 0.1);
			
			
			this.img_shadow.style.setProperty('--tX', `${ this.img_shadow_x }px`);
			this.img_shadow.style.setProperty('--tY', `${ this.img_shadow_y }px`);
		};
		
		this.app.update_loop.loop_functions.push(this.handleRodHeaderParallax);
	}
	
	destroy() {
		const loops = this.app.update_loop.loop_functions;
		const idx = loops.indexOf(this.handleRodHeaderParallax);
		if (idx !== -1) loops.splice(idx, 1);
	}
}
