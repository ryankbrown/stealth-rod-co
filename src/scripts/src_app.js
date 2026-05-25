// src_app.js - Stealth Rod Co - Application Class

import { SRC_ShopifyBuyBtn } from './src_shopify_buybtn.js';

import Interaction_UpdateLoop_GSAP from './interaction_update-loop-gsap.js';
import Interaction_NavController from './interaction_nav-controller.js';
import Interaction_SmoothScroll from './interaction_smooth-scroll.js';
import Interaction_ViewportObserver from './interaction_viewport-observer.js'
import Interaction_FixedContentStyler from './interaction_fixed-content-styler.js'
import Interaction_PointerTracker from './interaction_pointer-tracker.js'
// import Interaction_RodHeaders_ScrollAnim from './interaction_rod-headers.js'
import Interaction_RodHeaders_Parallax from './interaction_rod-headers-parallax.js'
import Interaction_SiteHeroHeaders_Parallax from './interaction_site-hero-headers-parallax.js';
import Interaction_HomeHero_Parallax from './interaction_home-hero-parallax.js';
// import Interaction_TaglineScrollParallax from './interaction_tagline-scroll-parallax.js';
import Interaction_FloatingImgSection from './interaction_floating-imgs-section.js';
import Interaction_FeatureParallaxImgs from './interaction_feature-parallax-imgs.js';
import Interaction_HighlightCircle from './interaction_highlight-circle.js';


// - - - SRC Site JS App Class - - - 
export default class SRC_App {
	constructor() {
		// Main GSAP Context
		this.gsap_ctx = gsap.context(() => {});
		this.update_loop = new Interaction_UpdateLoop_GSAP();
		// Must exist before Interaction_NavController runs (nav loops this on first deactivateNav).
		this.parallax_for_nav_pause = [];
		this.init();
	}
	init() {
		console.log("SRC - Initializing SRC App");
		// Global Interactions
		this.smooth_scroll = new Interaction_SmoothScroll(this);
		this.nav_controller = new Interaction_NavController(this);
		this.pointer_tracker = new Interaction_PointerTracker(this);
		
		this.fixed_content_styler = this.setupFixedContentStyler();
		this.viewport_observer = this.setupViewportObserver();
		
		// Component Interactions
		this.rod_headers_parallax = this.setupRodHeadersParallax();
		this.site_hero_headers_parallax = this.setupSiteHeroHeadersParallax();	
		this.home_hero_parallax = this.setupHomeHeroArea();
		this.floating_img_section = this.setupFloatingImgsSection();
		this.feature_parallax_imgs = this.setupFeatureParallaxImgs();
		this.highlight_circles = this.setupHighlightCircle();
		this.syncNavParallaxPauseList();	
	}

	/** Refill from current interaction fields so the nav can pause/resume in one loop. */
	syncNavParallaxPauseList() {
		if (!this.parallax_for_nav_pause) this.parallax_for_nav_pause = [];
		
		const list = this.parallax_for_nav_pause;
		
		list.length = 0;
		const addMany = (arr) => {
			if (!arr) return;
			for (let i = 0; i < arr.length; i++) list.push(arr[i]);
		};
		if (this.home_hero_parallax) list.push(this.home_hero_parallax);
		addMany(this.rod_headers_parallax);
		addMany(this.site_hero_headers_parallax);
		addMany(this.feature_parallax_imgs);
		addMany(this.highlight_circles);
		
	}

	setupViewportObserver() {
		const target_els = document.querySelectorAll('[data-detect-in-view]');
		if (!target_els.length) return null;
		return new Interaction_ViewportObserver(this, target_els);
	}
	setupFixedContentStyler() {
		const target_els = document.querySelectorAll('[data-fixed-content-styles]');
		if (!target_els.length) return null;
		return new Interaction_FixedContentStyler(this, target_els, this.update_loop);
	}
	
	setupRodHeadersParallax() {
		const target_els = document.querySelectorAll('.rod__header');
		if (!target_els.length) return null;
		return Array.from(target_els).map((el, idx)=> {
			return new Interaction_RodHeaders_Parallax(this, el, idx);
		});
	}
	
	setupFeatureParallaxImgs() {
		const target_els = document.querySelectorAll('.our-rods__ftr-img-holder');
		if (!target_els.length) return null;
		return Array.from(target_els).map((el)=> {
			return new Interaction_FeatureParallaxImgs(this, el);
		});
	}

	setupSiteHeroHeadersParallax() {
		const target_els = document.querySelectorAll('.global__hero-section');
		if (!target_els.length) return null;
		return Array.from(target_els).map((el, idx)=> {
			return new Interaction_SiteHeroHeaders_Parallax(this, el, idx);
		});
	}
	
	setupHomeHeroArea() {
		if ( !document.querySelector('.home__hero-section') ) return null;
		return new Interaction_HomeHero_Parallax(this);
	}
	
	setupFloatingImgsSection() {
		if ( !document.querySelector('.about__intro-section') ) return null;
		return new Interaction_FloatingImgSection(this, '.about__intro-section');
	}

	setupHighlightCircle() {
		const target_els = document.querySelectorAll('.global__highlight-circle');
		if (!target_els.length) return null;
		return Array.from(target_els).map((el, idx)=> {
			const highlight_container = el.closest('[data-highlight-circle-container]');
			return new Interaction_HighlightCircle(this, el, highlight_container, idx);
		});
	}

	destroyGlobalInteractions() {
		if (this.viewport_observer) {
			this.viewport_observer.destroy();
			this.viewport_observer = null;
		}
		if (this.fixed_content_styler) {
			this.fixed_content_styler.destroy();
			this.fixed_content_styler = null;
		}
		if (this.nav_controller) {
			this.nav_controller.destroy();
			this.nav_controller = null;
		}
		if (this.pointer_tracker) {
			this.pointer_tracker.destroy();
			this.pointer_tracker = null;
		}
		
		// Smooth scroll is created inside the GSAP context; letting
		// gsap_ctx.revert() handle its teardown keeps responsibilities clear.
		this.smooth_scroll = null;
	}

	destroyComponentInteractions() {
		if (this.parallax_for_nav_pause) this.parallax_for_nav_pause.length = 0;
		if (this.rod_headers_parallax) {
			this.rod_headers_parallax.forEach((interaction) => interaction.destroy());
			this.rod_headers_parallax = null;
		}
		if (this.site_hero_headers_parallax) {
			this.site_hero_headers_parallax.forEach((interaction) => interaction.destroy());
			this.site_hero_headers_parallax = null;
		}
		if (this.home_hero_parallax) {
			this.home_hero_parallax.destroy();
			this.home_hero_parallax = null;
		}
		if (this.feature_parallax_imgs) {
			this.feature_parallax_imgs.forEach((interaction) => interaction.destroy());
			this.feature_parallax_imgs = null;
		}
		if (this.highlight_circles) {
			this.highlight_circles.forEach((interaction) => interaction.destroy());
			this.highlight_circles = null;
		}
		
		this.gsap_ctx.revert();
	}
}
