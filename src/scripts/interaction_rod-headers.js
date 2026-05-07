

export default class Interaction_RodHeaders_ScrollAnim {
	constructor(app, header_el, header_idx) {
		this.app = app;
		this.rod_header_el = header_el;
		this.header_idx = header_idx;
		
		this.heading = this.rod_header_el.querySelector('.rod__heading')
		this.heading_container = this.rod_header_el.querySelector('.rod__heading-container')
		
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
				
				// create timeline
				const dsk_tl = gsap.timeline({ paused:true })
				.to(this.heading_container, {
					yPercent: -15,
					duration: 2,
					ease: "none"
				});
				
				ScrollTrigger.create({
					trigger: this.rod_header_el,
					//<trigger> <scroller>
					start: "top bottom",
					end: "top top",
					
					// end: "top bottom",
					scrub: true,
					markers: true,
					animation: dsk_tl,
				});
			});
			
		}, this.rod_header_el)
	}

	destroy() {
		this.match_media_opts?.revert();
		this.match_media_opts = null;
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