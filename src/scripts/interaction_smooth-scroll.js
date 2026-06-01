//https://gsap.com/docs/v3/Plugins/ScrollSmoother/


export default class Interaction_SiteSmoothScroll {
	constructor(app, opts={
		smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
		effects: true, // looks for data-speed and data-lag attributes on elements
		// smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
	}) {
		this.app = app;
		this.opts = opts;
		this.app.gsap_ctx.add(()=> {
			// ScrollTrigger.normalizeScroll(true);
			
			// ScrollTrigger.normalizeScroll(true);
			// ScrollTrigger.config({ ignoreMobileResize: true });
			
			this.smooth_scroller = ScrollSmoother.create(opts, gsap); 	
		})
	}
	
	handleSmoothAnchorScroll(e) {
		e.preventDefault();
		const target = e.currentTarget.getAttribute('href');
		this.smooth_scroller.scrollTo(target, true, "top 100px");
		
		// // Smooth scroll with default easing — less control
		// this.smooth_scroller.scrollTo("#target", true, "top 100px");
		
		// more control over the smooth scroll tween
		// gsap.to(smoother, {
		// 	scrollTop: Math.min(
		// 	  ScrollTrigger.maxScroll(window),
		// 	  smoother.offset("#target", "top top")
		// 	),
		// 	duration: 1.5,
		// 	ease: "power3.inOut"
		//  });
	}
	
	// convert in-page anchor links to smooth scroll links
	convertAnchorLinks() {
		this.pg_anchor_links = document.querySelectorAll('a[href^="#"]');
		
		if (!this.pg_anchor_links?.length) {
			this.pg_anchor_links.forEach(link => {
				link.addEventListener('click', this.handleSmoothAnchorScroll.bind(this));
			});	
		}
	}
	
	destroy() {
		
		if (!this.pg_anchor_links?.length) {
			this.pg_anchor_links.forEach(link => {
				link.removeEventListener('click', this.handleSmoothAnchorScroll.bind(this));
			});
		}
	}
}