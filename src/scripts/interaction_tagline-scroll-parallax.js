export default class Interaction_TaglineScrollParallax {
	constructor(app, tagline_section_el) {
		this.app = app;
		this.tagline_section_el = typeof tagline_section_el === 'string' ? document.querySelector(tagline_section_el) : tagline_section_el;

		this.sky_img = this.tagline_section_el.querySelector('.tagline__img--sky');
		this.text_wrapper = this.tagline_section_el.querySelector('.tagline__text-wrapper');
		this.text_tuned = this.tagline_section_el.querySelector('.tagline__svg-wrapper--tuned');
		this.text_strike = this.tagline_section_el.querySelector('.tagline__svg-wrapper--strike');
		this.fg_img = this.tagline_section_el.querySelector('.tagline__img--fg');

		this.gsap_ctx = gsap.context(() => {
			// ScrollSmoother: ScrollTrigger must follow *native* scroll (default scroller).
			// Do NOT set scroller to #smooth-content — that node is transform-moved, not scrollTop-driven;
			// progress won’t update correctly and scrubbed tweens appear frozen or wrong.

			this.tl = gsap.timeline({
				paused: true,
				scrollTrigger: {
					trigger: this.tagline_section_el,
					start: 'top bottom',
					end: 'top top-=100%',
					scrub: true,
					markers: true,
				},
			})
				.fromTo(
					this.sky_img,
					{
						autoAlpha: 0,
						scale: 1.3,
						yPercent: 50,
					},
					{
						scale: 1,
						xPercent: 0,
						autoAlpha: 1,
						yPercent: 10,
						duration: 10,
						ease: 'power4.out',
					}
				)

				.from(
					this.fg_img,
					{
						yPercent: 25,
						duration: 10,
						ease: 'power4.out',
					},
					'<'
				)

				.fromTo(
					this.text_wrapper,
					{
						scale: 0.9,
						yPercent: 500,
					},
					{
						scale: 1,
						yPercent: -100,
						duration: 5,
						ease: 'power4.out',
					},
					'<'
				);
		});
	}

	destroy() {
		if (this.gsap_ctx) {
			this.gsap_ctx.revert();
		}
	}
}
