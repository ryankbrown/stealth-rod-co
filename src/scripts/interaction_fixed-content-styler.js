export default class Interaction_FixedContentStyler {
	constructor(app, observe_els, updateLoop) {
		this.app = app;
		this.targets = Array.from(observe_els || []);
		this.nav_el = document.querySelector('.main-nav');
		this.updateLoop = updateLoop;
		this.updateFn = null;
		// Cache the currently applied value to avoid unnecessary DOM writes.
		this.currentStyleValue = document.body.getAttribute('data-applied-fixed-content-styles');

		this.init();
		
	}

	init() {
		if (!this.targets.length) return;
		if (!this.nav_el) return;
		if (!this.updateLoop) return;

		this.updateFn = () => {
			// console.log('fixedContentStyler updateFn');
			const navRect = this.nav_el.getBoundingClientRect();
			let best = null;
			let maxOverlap = 0;

			for (const el of this.targets) {
				if (!el.dataset.fixedContentStyles) continue;

				const rect = el.getBoundingClientRect();
				const overlap =
					Math.min(navRect.bottom, rect.bottom) -
					Math.max(navRect.top, rect.top);

				if (overlap > 0 && overlap > maxOverlap) {
					maxOverlap = overlap;
					best = el;
				}
			}

			if (best) {
				this.applyFixedContentStyles(best);
			}
		};

		this.updateLoop.loop_functions.push(this.updateFn);
	}

	applyFixedContentStyles(el) {

		const styleValue = el.dataset.fixedContentStyles;
		
		if (!styleValue) return;

		if (this.currentStyleValue === styleValue) return;

		this.currentStyleValue = styleValue;
		
		document.body.setAttribute('data-applied-fixed-content-styles', styleValue);
	}

	destroy() {
		if (this.updateLoop && this.updateFn) {
			const idx = this.updateLoop.loop_functions.indexOf(this.updateFn);
			if (idx > -1) {
				this.updateLoop.loop_functions.splice(idx, 1);
			}
		}
		this.targets = [];
		this.updateFn = null;
	}
}

