

export default class Interaction_RodHeaders_ScrollAnim {
	constructor(app, header_el, header_idx) {
		this.app = app;
		this.rod_header_el = header_el;
		this.header_idx = header_idx;
		
		this.heading = this.rod_header_el.querySelector('.rod__heading')
		this.img = this.rod_header_el.querySelector('.rod__header-img')
		this.img_shadow = this.rod_header_el.querySelector('.rod__header-img-shadow')
		this.img_positioner = this.rod_header_el.querySelector('.rod__header-img-positioner')
		this.img_rotate_scale_wrapper = this.rod_header_el.querySelector('.rod__header-img-rotate-scale-wrapper')
		
		this.app.gsap_ctx.add(() => {
			
			this.breakpoint = 479;
			this.match_media_opts = gsap.matchMedia();
			
			this.match_media_opts.add({
				isMobile: `(max-width: ${this.breakpoint}px)`,
			}, (context) => {
				this.createScrollTrigger({
					animation: this.mobile_tl(),
				});
			});
			
			this.match_media_opts.add({
				isDesktop: `(min-width: ${this.breakpoint + 1}px)`,
			}, (context) => { 
				this.createScrollTrigger({
					animation: this.main_tl(),
				});
			});
			
		}, this.rod_header_el)
	}

	destroy() {
		this.match_media_opts?.revert();
		this.match_media_opts = null;
		this.scroll_trigger = null;
	}
	
	createScrollTrigger(opts) {
		this.scroll_trigger = ScrollTrigger.create({
			trigger: this.rod_header_el,
			//<trigger> <scroller>
			start: "top center+=25%",
			end: "bottom center-=25%",
			// scrub: true,
			markers: true,
			animation: opts.animation
		});
	}
	
	main_tl() {
		return gsap.timeline({ paused:true })
			
			.from([
				this.img,
				this.img_shadow
			], {
				autoAlpha: 0,
				xPercent: 5,
				duration: 2,
				ease: "expo.out"
			})
			.fromTo(this.heading, {
				autoAlpha: 0,
				yPercent: 100,
			}, {
				autoAlpha: 1,
				yPercent: -10,
				duration: 2,
				ease: "expo.out"
			}, '<+.15')
			// .from(this.heading, {
			// 	letterSpacing: "0px",
			// 	duration: 2,
			// 	ease: "expo.out"
			// }, '<')
	}
	
	mobile_tl() {
		return gsap.timeline({ paused:true })
	}
	
}


// export class Interaction_RodHeadersParallax {
// 	constructor(app, pointer_parallax_elements = []) {
// 		this.app = app;
// 		this.interaction_active = false;

// 		const valid = pointer_parallax_elements.filter(Boolean);
// 		if (valid.length === 0) {
// 			this.pointer_parallax_elements = [];
// 			return;
// 		}

// 		this.pointer_parallax_elements = valid.map(element => {
// 			const rateAttr = parseFloat(element.getAttribute('data-pointer-parallax-rate'));
// 			return {
// 				el: element,
// 				rate: isNaN(rateAttr) ? 1 : rateAttr,
// 				xTo: gsap.quickTo(element, 'x', { duration: 1, ease: "power4.out" }),
// 				yTo: gsap.quickTo(element, 'y', { duration: 1, ease: "power4.out" })
// 			};
// 		});
// 	}
// 	activateParallax() {
// 		if (!this.pointer_parallax_elements.length || this.interaction_active) return;
// 		this.interaction_active = true;
// 		window.addEventListener('pointermove', this.handleParallax.bind(this));
// 	}
// 	deactivateParallax() {
// 		if (!this.interaction_active) return;
// 		this.interaction_active = false;
// 		window.removeEventListener('pointermove', this.handleParallax.bind(this));
// 	}
// 	handleParallax(e) {
// 		const xRatio = e.clientX / window.innerWidth - 0.5;
// 		const yRatio = e.clientY / window.innerHeight - 0.5;

// 		this.pointer_parallax_elements.forEach(obj => {
// 			obj.xTo(xRatio * 50 * obj.rate);
// 			obj.yTo(yRatio * 5 * obj.rate);
// 		});
// 	}
// }