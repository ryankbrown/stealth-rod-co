export default class Interaction_ViewportObserver {
	constructor(app, observe_els, root_el) {
		this.app = app;
		this.observed_els = Array.from(observe_els || []);
		// this.sideNav = document.querySelector(".side-nav");
		this.root_el = root_el;
		this.init();
	}

	init() {
		if (!this.observed_els.length) return;

		// - - - Primary Intersection Observer - - - 
		// Intersection Observer is a native web API that allows you to observe the intersection of a target element with the viewport. You create an observer element, here called "main_intersection_observer", 

		this.main_intersection_observer = new IntersectionObserver(
			// The first parameter in a Intersection Observer defines what should happen with each element that is observed.

			(all_elements) => {
				for (const entry of all_elements) {
					// - - - Handle applciation of .in-view / .not-in-view classes - - - 
					this.handleInViewClasses(entry);
				}
			}, 
			
			// The second paramenter for the Intersection Observer is an options object.
			{
				// The viewport element that will be scrolled within
				root: this.root_el,

				// An inset margin around the root element that triggers intersecting
				rootMargin: '-1px',

				// The threshold property is used to set the percentage of the element that needs to be in view to trigger the intersection observer.
				// Use a low threshold so animations can kick in early.
				threshold: 0.01
			});
			
		this.observed_els.forEach((el) => this.main_intersection_observer.observe(el));
	}

	// This works in conjunction with the "data-detect-in-view" attribute to add the "in-view" and "not-in-view" classes to the element that is being observed. This is used to trigger animations.
	handleInViewClasses(el) {
		if (el.isIntersecting) {
			el.target.classList.add('in-view');
			el.target.classList.remove('not-in-view');
		} else {
			el.target.classList.add('not-in-view'); 
			el.target.classList.remove('in-view');
		}
	}
	
	destroy() {
		if (this.main_intersection_observer) {
			this.observed_els.forEach((el) => this.main_intersection_observer.unobserve(el));
			this.main_intersection_observer.disconnect();
			this.main_intersection_observer = null;
		}
		this.observed_els = [];
	}
}
