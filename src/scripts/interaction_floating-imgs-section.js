export default class Interaction_FloatingImgSection {
	constructor(app, floating_section_el) {
		
		this.app = app;
		this.floating_section_el = typeof floating_section_el === 'string' ? document.querySelector(floating_section_el) : floating_section_el;
		this.intro_text_content = this.floating_section_el.querySelector(".about__intro-text-content");
		
		this.bg_img = this.floating_section_el.querySelector(".about__intro-bg-img-container");
		this.end_trigger = this.floating_section_el.querySelector(".about__intro-floating-imgs");
		
		// Same trigger for both so they share one scroll range; snap then keeps both in sync
		this.shared_scroll_opts = {
			trigger: this.floating_section_el,
			start: "top top",
			end: "bottom center+=15%",
			endTrigger: this.end_trigger,
			scrub: 1,
			anticipatePin: true,
			pinSpacing: false,
			// normalizeScroll: true
		}

		this.gsap_ctx = gsap.context(() => {
			this.init();
		}, this.floating_section_el);
		
	}

	init() {
		// console.log(`%cCreating Floating Img Interaction for: ${this.floating_section_el.id || this.floating_section_el.classList[0]}`, "color: cyan")
		
		this.createMainOverlayTimeline();
		this.createOverlaidContentScrollTrigger();
		// this.createImagesTimeline();
		this.createBgImgTimelineTrigger()
	}

	createMainOverlayTimeline() {
		
		const paragraph = new SplitText(
			this.floating_section_el.querySelector(".about__intro-paragraph"), 
			{ type: "lines"}
		);
		
		this.main_scroll_tl = gsap.timeline({paused: true})

		// - - - - - TWEENS - - - - -				
		.addLabel('scroll-started')
		
		.from(this.intro_text_content, { duration: .25 }) // wait
		
		// - - - - - TWEEN IN - - - - -	
		.from('.about__intro-heading--40', {
			scale: 0.8,
			alpha: 0,
			transformOrigin: "center center",
			duration: 4,
			ease: "expo.out"
		})
		.from([
			'.about__intro-heading--years',
			'.about__intro-heading--lake',
		], {
			scale: 0.8,
			alpha: 0,
			transformOrigin: "center center",
			duration: 4,
			ease: "expo.out",
			stagger: .5
		})
		.from(paragraph.lines, {
			autoAlpha: 0,
			duration: 1,
			stagger: 0.05,
			ease: "power1.out"
		}, '<')
		
		// - - - - - TWEEN MIDPOINT - - - - -	
		.addLabel('scroll-midpoint')
		.from(this.intro_text_content, { duration: 8 }) // wait
		
		// - - - - - TWEEN OUT - - - - -	
		.to('.about__intro-heading--40', {
			scale: 1.1,
			alpha: 0,
			transformOrigin: "center center",
			duration: 1,
			ease: "expo.in"
		})
		.from([
			'.about__intro-heading--years',
			'.about__intro-heading--lake',
		], {
			scale: 1.1,
			alpha: 0,
			transformOrigin: "center center",
			duration: 1,
			ease: "expo.in",
			stagger: .5
		}, '<')
		.to(paragraph.lines, {
			yPercent: -10,
			alpha: 0,
			duration: 1,
			stagger: 0.15,
			ease: "power1.in"
		}, '<')
		.from(this.intro_text_content, { duration: .5 })
		
		.addLabel('scroll-finished')
	}
	
	createOverlaidContentScrollTrigger() {
		this.overlaid_content_scrolltrigger = ScrollTrigger.create({
			...this.shared_scroll_opts,
			pin: this.intro_text_content,
			animation: this.main_scroll_tl,
		});
	}
	
	createBgImgTimelineTrigger() {
		this.bg_img_timeline_trigger = gsap.timeline({
			paused: true,
			scrollTrigger: {
				...this.shared_scroll_opts,
				pin: this.bg_img,
				pinReparent: true,
			}
		})
		.from(this.bg_img, {
			scale: 1.2,
			autoAlpha: 0,
			duration: 1,
			ease: "power1.out"
		}, 0)
		.to(this.bg_img, {
			scale: 1.2,
			autoAlpha: 0,
			duration: 1,
			ease: "power1.in"
		})
	}
	
	destroy() {
		this.gsap_ctx.revert();
	}
}
