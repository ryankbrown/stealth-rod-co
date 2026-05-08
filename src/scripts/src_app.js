// src_app.js - Stealth Rod Co - Application Class

import { SRC_ShopifyBuyBtn } from './src_shopify_buybtn.js';

// import Interaction_UpdateLoop from './interaction_update-loop.js';
import Interaction_UpdateLoop_GSAP from './interaction_update-loop-gsap.js';
import Interaction_NavController from './interaction_nav-controller.js';
import Interaction_SmoothScroll from './interaction_smooth-scroll.js';
import Interaction_ViewportObserver from './interaction_viewport-observer.js'
import Interaction_FixedContentStyler from './interaction_fixed-content-styler.js'
import Interaction_PointerTracker from './interaction_pointer-tracker.js'
// import Interaction_RodHeaders_ScrollAnim from './interaction_rod-headers.js'
import Interaction_RodHeaders_Parallax from './interaction_rod-headers-parallax.js'
import Interaction_SiteHeaders_Parallax from './interaction_site-header-parallax.js';



// - - - SRC Site JS App Class - - - 
export default class SRC_App {
	constructor() {
		// Main GSAP Context
		this.gsap_ctx = gsap.context(() => {});
		this.update_loop = new Interaction_UpdateLoop_GSAP();
		
		console.log("SRC - Initializing SRC App");
		this.init();
	}
	init() {
		
		// Global Interactions
		this.smooth_scroll = new Interaction_SmoothScroll(this);
		this.nav_controller = new Interaction_NavController(this);
		this.pointer_tracker = new Interaction_PointerTracker(this);
		
		this.fixed_content_styler = this.setupFixedContentStyler();
		this.viewport_observer = this.setupViewportObserver();
		this.rod_headers_parallax = this.setupRodHeadersParallax();
		this.site_headers_parallax = this.setupSiteHeadersParallax();
		
		// Component Interactions
		// this.rod_headers_scroll = this.getRodHeadersScrollAnims();
		// this.background_video = this.getBackgroundVideo();
		// this.floating_img_sections = this.getFloatingImgSections();
		// this.sidescrollers = this.getSidescrollers();
		// this.project_sidescrollers = this.getProjectSidescrollers();
		// this.crossfaders = this.getCrossfaders();
		// this.bio_overlays = this.getBioOverlays();
		// this.craft_scrollsects = this.getCraftScrollSects();
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

	setupSiteHeadersParallax() {
		const target_els = document.querySelectorAll('.global__hero');
		if (!target_els.length) return null;

		return Array.from(target_els).map((el, idx)=> {
			return new Interaction_SiteHeaders_Parallax(this, el, idx);
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
			// currently only partially cleans up, but call destroy for parity
			this.nav_controller.destroy();
			this.nav_controller = null;
		}
		if (this.rod_headers_parallax) {
			this.rod_headers_parallax.forEach((interaction) => interaction.destroy());
			this.rod_headers_parallax = null;
		}
		if (this.site_headers_parallax) {
			this.site_headers_parallax.forEach((interaction) => interaction.destroy());
			this.site_headers_parallax = null;
		}
		
		// Smooth scroll is created inside the GSAP context; letting
		// gsap_ctx.revert() handle its teardown keeps responsibilities clear.
		this.smooth_scroll = null;
	}

	destroyComponentInteractions() {
		// if (this.fb_floating_img_sections) {
		// 	this.fb_floating_img_sections.forEach(interaction => interaction.destroy());
		// 	this.fb_floating_img_sections = null;
		// }
		// if (this.fb_sidescrollers) {
		// 	this.fb_sidescrollers.forEach(interaction => interaction.destroy());
		// 	this.fb_sidescrollers = null;
		// }
		// if (this.fb_project_sidescrollers) {
		// 	this.fb_project_sidescrollers.forEach(interaction => interaction.destroy());
		// 	this.fb_project_sidescrollers = null;
		// }
		// if (this.fb_crossfaders) {
		// 	this.fb_crossfaders.forEach(interaction => interaction.destroy());
		// 	this.fb_crossfaders = null;
		// }
		// if (this.fb_bio_overlays) {
		// 	this.fb_bio_overlays.forEach(interaction => interaction.destroy());
		// 	this.fb_bio_overlays = null;
		// }
		// if (this.fb_background_video) {
		// 	this.fb_background_video.destroy();
		// 	this.fb_background_video = null;
		// }
		// if (this.fb_craft_scrollsects) {
		// 	this.fb_craft_scrollsects.forEach(interaction => interaction.destroy());
		// 	this.fb_craft_scrollsects = null;
		// }
		
		// if (this.rod_headers_scroll) {
		// 	this.rod_headers_scroll.forEach((interaction) => interaction.destroy());
		// 	this.rod_headers_scroll = null;
		// }
		this.gsap_ctx.revert();
	}
}
