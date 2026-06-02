

// - - - FB Site Interactions - - - 

//https://gsap.com/docs/v3/Plugins/ScrollSmoother/


export default class Interaction_SiteSmoothScroll {
	constructor(app, opts={
		smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
		effects: true, // looks for data-speed and data-lag attributes on elements
		// smoothTouch: 0.1 // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
		smoothTouch: false
	}) {
		this.app = app;
		this.opts = opts;
		this.app.gsap_ctx.add(()=> {
			this.smooth_scroller = ScrollSmoother.create(opts, gsap); 	
		})
	}
}