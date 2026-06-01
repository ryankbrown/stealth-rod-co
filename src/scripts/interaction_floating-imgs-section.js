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
			// end: "bottom bottom", // src original setting but may be causing bug
			end: "bottom center+=25%",
			endTrigger: this.end_trigger,
			scrub: 1,
			anticipatePin: true,
			pinSpacing: false,
			// markers: true
		}
		
		// Only apply this effect on devices above 767px
		this.match_media = gsap.matchMedia();
		this.match_media.add(
			{
				isDesktop: "(min-width: 767px)",
			},
			(context) => {
				this.createMainOverlayTimeline();
				this.createOverlaidContentScrollTrigger();
				this.createBgImgTimelineTrigger()
			}
		);
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
		.from(paragraph.lines, {
			autoAlpha: 0,
			duration: 1.25,
			stagger: 0.15,
			ease: "power1.out"
		}, '<')
		// .from(".about__intro-paragraph", {
		// 	autoAlpha: 0,
		// 	duration: 1.25,
		// 	ease: "power1.out"
		// })
		
		// - - - - - TWEEN MIDPOINT - - - - -	
		.addLabel('scroll-midpoint')
		.from(this.intro_text_content, { duration: 8 }) // wait
		.to('.about__intro-text-content', {
			yPercent: -10,
			alpha: 0,
			duration: 3,
			ease: "power4.in"
		})
		.from(this.intro_text_content, { duration: .25 })
		
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
		.from(this.bg_img, { duration: this.main_scroll_tl.totalDuration() })
	}
	
	destroy() {
		this.gsap_ctx.revert();
	}
}




