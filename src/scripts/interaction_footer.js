export default class Interaction_FooterScrollAnim {
	constructor(app) {
		this.app = app;
		this.footer_el = document.querySelector('.global__footer');
		this.footer_stealth_svg = this.footer_el.querySelector('.footer__stealth-svg');
		this.footer_steath_letters = document.querySelectorAll('[class*="stealth-letter"]');

		this.gsap_ctx = gsap.context(() => {
			// ScrollSmoother: ScrollTrigger must follow *native* scroll (default scroller).
			// Do NOT set scroller to #smooth-content — that node is transform-moved, not scrollTop-driven;
			// progress won’t update correctly and scrubbed tweens appear frozen or wrong.

			this.tl = gsap.timeline({
				paused: true,
				scrollTrigger: {
					trigger: this.footer_el,
					start: 'center bottom',
					end: 'top center-=25%',

					scrub: true,
					// markers: true,
				},
			})
			.from(this.footer_stealth_svg, {
				yPercent: 100,
				duration: 10,
				ease: 'power4.out',
			})
			.from(this.footer_steath_letters, {
				// x: (index, target, el) => {
				// 	// Offset each letter from the center of the footer by a fixed percentage
				// 	const footerRect = this.footer_el.getBoundingClientRect();
				// 	const letterRect = el.getBoundingClientRect();
				// 	const footerCenter = footerRect.x + footerRect.width / 2;
				// 	const letterCenter = letterRect.x + letterRect.width / 2;
				// 	const distanceFromCenter = letterCenter - footerCenter;
				// 	// Animate from -25% of this per original logic
				// 	return distanceFromCenter * -0.25;
				// },
				scale: 1.2,
				duration: 10,
				ease: 'power4.out',
				transformOrigin: 'center center',
			}, '<');
		});
	}

	destroy() {
		if (this.gsap_ctx) {
			this.gsap_ctx.revert();
		}
	}
}
