export default class Interaction_RodHeaders_ShadowScrollMove {
	constructor(app, header_el, header_idx) {
		this.app = app;
		this.rod_header_el = header_el;
		this.rod_header_shadow = this.rod_header_el.querySelector('.rod__header-img-shadow');
		if (!this.rod_header_shadow) return;

		this.breakpoint = 479;
		this.match_media_opts = gsap.matchMedia();

		this.match_media_opts.add(
			{
				isMobile: `(max-width: ${this.breakpoint}px)`,
			},
			() => {
				const mob_tl = gsap.timeline({ paused: true })
					.fromTo(this.rod_header_shadow, {
						yPercent: 20,
					}, {
						yPercent: -23,
						duration: 2,
						ease: 'power4.inOut',
					});

				ScrollTrigger.create({
					trigger: this.rod_header_el,
					// start: 'top+=25% bottom',
					// end: 'top top',
					scrub: true,
					animation: mob_tl,
				});
			},
			this.rod_header_el,
		);

		this.match_media_opts.add(
			{
				isDesktop: `(min-width: ${this.breakpoint + 1}px)`,
			},
			() => {
				const dsk_tl = gsap.timeline({ paused: true })
					.fromTo(this.rod_header_shadow, {
						yPercent: 30,
					}, {
						yPercent: 5,
						duration: 2,
						ease: 'power2.inOut',
					});

				ScrollTrigger.create({
					trigger: this.rod_header_el,
					start: 'top bottom',
					end: 'top top',
					scrub: true,
					animation: dsk_tl,
				});
			},
			this.rod_header_el,
		);
	}

	destroy() {
		this.match_media_opts?.revert();
		this.match_media_opts = null;
	}
}