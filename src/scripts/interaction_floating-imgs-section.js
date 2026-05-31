export default class Interaction_FloatingImgSection {
	constructor(app) {
		
		this.app = app;
		this.floating_section_el = document.querySelector(".about__intro-section");
		this.section_content = this.floating_section_el.querySelector(".about__intro-content");
		
		this.intro_text_content = this.floating_section_el.querySelector(".about__intro-text-content");
		this.floating_imgs_container = this.floating_section_el.querySelector(".about__intro-floating-imgs");
		this.bg_img = this.floating_section_el.querySelector(".about__intro-bg-img-container");
		
		
		// return;
		this.gsap_ctx = gsap.context(() => {
			
			// this.section_content.style.height = "100lvh";
			
			console.log(this.floating_section_el);
			
			// this.init();
			
			// - - - - - TEXT TIMELINE - - - - -	
			
			const paragraph = new SplitText(
				this.floating_section_el.querySelector(".about__intro-paragraph"), 
				{ type: "lines"} 
			);
			
			const text_tl = gsap.timeline({ paused: true })
				.from(this.intro_text_content, { 
					duration: 1,
					// alpha: 0,
				})
				// .addLabel('scroll-started')
				// .from(this.intro_text_content, { duration: .25 }) // wait
				// .from(paragraph.lines, {
				// 	autoAlpha: 0,
				// 	duration: 1.25,
				// 	stagger: 0.15,
				// 	ease: "power1.out"
				// }, '<')
				// .addLabel('scroll-midpoint')
				// .from(this.intro_text_content, { duration: 8 }) // wait
				// .to('.about__intro-text-content', {
				// 	yPercent: -10,
				// 	alpha: 0,
				// 	duration: 3,
				// 	ease: "power4.in"
				// })
				// .from(this.intro_text_content, { duration: .25 })
				// .addLabel('scroll-finished')
			
			
			// - - - - - SCROLL TRIGGER TIMELINE - - - - -	
		
			this.main_scroll_tl = gsap.timeline({ 
				paused: true,
				scrollTrigger: {
					trigger: this.floating_section_el,
					// <trigger> <scroller>
					start: "top top",
					end: "bottom bottom+=600%",
					// endTrigger: ".about__intro-content",
					markers: true,
					scrub: 1,
					pin: true,
				}
			})
			.to(this.floating_imgs_container, { 
				yPercent: -80,
				ease: "none",
				duration: 1
			}, 0)
			.from(this.intro_text_content, { 
				duration: 1,
				// alpha: 0,
			}, 0)
			
		}, this.floating_section_el);
	}
	destroy() {
		this.gsap_ctx.revert();
	}
}




// export default class Interaction_FloatingImgSection {
// 	constructor(app, floating_section_el) {
		
// 		this.app = app;
// 		this.floating_section_el = typeof floating_section_el === 'string' ? document.querySelector(floating_section_el) : floating_section_el;
// 		this.intro_text_content = this.floating_section_el.querySelector(".about__intro-text-content");
		
// 		this.bg_img = this.floating_section_el.querySelector(".about__intro-bg-img-container");
// 		this.end_trigger = this.floating_section_el.querySelector(".about__intro-floating-imgs");
		
// 		// Same trigger for both so they share one scroll range; snap then keeps both in sync
// 		this.shared_scroll_opts = {
// 			trigger: this.floating_section_el,
// 			start: "top top",
// 			end: "bottom bottom",
// 			endTrigger: this.end_trigger,
// 			scrub: 1,
// 			anticipatePin: true,
// 			pinSpacing: false,
// 			// normalizeScroll: true
// 		}

// 		this.gsap_ctx = gsap.context(() => {
// 			this.init();
// 		}, this.floating_section_el);
		
// 	}

// 	init() {
// 		// console.log(`%cCreating Floating Img Interaction for: ${this.floating_section_el.id || this.floating_section_el.classList[0]}`, "color: cyan")
		
// 		this.createMainOverlayTimeline();
// 		this.createOverlaidContentScrollTrigger();
// 		this.createBgImgTimelineTrigger()
// 	}

// 	createMainOverlayTimeline() {
		
// 		const paragraph = new SplitText(
// 			this.floating_section_el.querySelector(".about__intro-paragraph"), 
// 			{ type: "lines"}
// 		);
		
		
		
// 		this.main_scroll_tl = gsap.timeline({paused: true})

// 		// - - - - - TWEENS - - - - -				
// 		.addLabel('scroll-started')
		
// 		.from(this.intro_text_content, { duration: .25 }) // wait
// 		.from(paragraph.lines, {
// 			autoAlpha: 0,
// 			duration: 1.25,
// 			stagger: 0.15,
// 			ease: "power1.out"
// 		}, '<')
		
// 		// - - - - - TWEEN MIDPOINT - - - - -	
// 		.addLabel('scroll-midpoint')
// 		.from(this.intro_text_content, { duration: 8 }) // wait
// 		.to('.about__intro-text-content', {
// 			yPercent: -10,
// 			alpha: 0,
// 			duration: 3,
// 			ease: "power4.in"
// 		})
// 		.from(this.intro_text_content, { duration: .25 })
		
// 		.addLabel('scroll-finished')
// 	}
	
// 	createOverlaidContentScrollTrigger() {
// 		this.overlaid_content_scrolltrigger = ScrollTrigger.create({
// 			...this.shared_scroll_opts,
// 			pin: this.intro_text_content,
// 			animation: this.main_scroll_tl,
// 		});
// 	}
	
// 	createBgImgTimelineTrigger() {
// 		this.bg_img_timeline_trigger = gsap.timeline({
// 			paused: true,
// 			scrollTrigger: {
// 				...this.shared_scroll_opts,
// 				endTrigger: this.end_trigger,
// 				pin: this.bg_img,
// 				// pinReparent: true,
// 				// markers: true
// 			}
// 		})
// 		.from(this.bg_img, { duration: this.main_scroll_tl.totalDuration() })
// 		// .from(this.bg_img, {
// 		// 	scale: 1.4,
// 		// 	duration: 1,
// 		// 	transformOrigin: "center top",
// 		// 	ease: "power1.out"
// 		// }, 0)
// 		// .to(this.bg_img, {
// 		// 	scale: 1.4,
// 		// 	transformOrigin: "center top",
// 		// 	duration: 1,
// 		// 	ease: "power1.in"
// 		// })
// 	}
	
// 	destroy() {
// 		this.gsap_ctx.revert();
// 	}
// }




