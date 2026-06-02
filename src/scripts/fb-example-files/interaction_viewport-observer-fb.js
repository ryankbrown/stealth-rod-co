

export default class Interaction_ViewportObserver {
	constructor(app, observe_els) {
		this.app = app;
		this.observed_els = Array.from(observe_els || []);
		this.sideNav = document.querySelector(".side-nav");
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

					// - - - Handle hiding the side nav - - - 
					// Temporarily disabled until side nav is implemented.
					// if (this.sideNav) {
					// 	this.handleHideSideNav(entry);
					// }

					// - - - Handle which side nav items are highlighted - - - 
					// Temporarily disabled until side nav is implemented.
					// if (entry.isIntersecting && this.sideNav) {
					// 	this.handleSideNavStyles(entry.target);
					// }
				}
			}, 
			
			// The second paramenter for the Intersection Observer is an options object.
			{
				// ScrollSmoother: wrapper = viewport, content = moving inner div. Use wrapper so we intersect against the visible area.
				root: document.querySelector('#smooth-wrapper') ?? null,

				// An inset margin around the root element that triggers intersecting
				rootMargin: '-10px',

				// The threshold property is used to set the percentage of the element that needs to be in view to trigger the intersection observer.
				// Use a low threshold so animations can kick in early.
				threshold: 0.1
			});
			
		this.observed_els.forEach((el) => this.main_intersection_observer.observe(el));
	}

	handleSideNavStyles(el) {
		if (el.id.length && this.sideNav) {
			const allSideNavLinks = this.sideNav.querySelectorAll(".side-nav__link");
			allSideNavLinks.forEach((link) => link.classList.remove("link-active"));
			const sideNavLink = this.sideNav.querySelector(`[href="#${el.id}"]`);
			if (sideNavLink !== null) {
				sideNavLink.classList.add("link-active");
			}
		}
	}

	// For hiding the side nav when the user scrolls past the section that has the "data-hide-side-nav" attribute. Note: force-hide is applied automatically to the side nav via the markup. This function is used to unhide it on appropriate pages via the "data-detect-in-view" attribute  and "data-hide-side-nav" attribute in the markup.
	handleHideSideNav(el) {
		if (el.isIntersecting && this.sideNav) {
			if (el.target.hasAttribute('data-hide-side-nav')) {
				this.sideNav.classList.add('force-hide');
			} else {
				this.sideNav.classList.remove('force-hide');
			}
		}
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
