// src_app.js - Stealth Rod Co - Application Class

import { SRC_ShopifyBuyBtn } from './src_shopify_buybtn.js';

// import Interaction_UpdateLoop from './interaction_update-loop.js';
import Interaction_UpdateLoop_GSAP from './interaction_update-loop-gsap.js';
import Interaction_NavController from './interaction_nav-controller.js';
import Interaction_SmoothScroll from './interaction_smooth-scroll.js';
import Interaction_ViewportObserver from './interaction_smooth-scroll.js'
import Interaction_FixedContentStyler from './interaction_fixed-content-styler'
import Interaction_RodHeaders_ScrollAnim from './interaction_rod-headers.js'


// - - - SRC Site JS App Class - - - 
export default class SRC_App {
	constructor() {
		// Main GSAP Context
		this.gsap_ctx = gsap.context(() => {});
		this.update_loop = new Interaction_UpdateLoop_GSAP();
		this.init();
	}
	init() {
		// Global Interactions
		this.smooth_scroll = new Interaction_SmoothScroll(this);
		this.nav_controller = new Interaction_NavController(this);
		this.viewport_observer = this.getViewportObserver();
		this.fixed_content_styler = this.getFixedContentStyler();
		
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

	getViewportObserver() {
		const target_els = document.querySelectorAll('[data-detect-in-view=true]');
		if (!target_els.length) return null;
		return new Interaction_ViewportObserver(this, target_els);
	}
	getFixedContentStyler() {
		const target_els = document.querySelectorAll('[data-fixed-content-styles]');
		if (!target_els.length) return null;
		return new Interaction_FixedContentStyler(this, target_els, this.update_loop);
	}
	// getRodHeadersScrollAnims() {
	// 	const target_els = document.querySelectorAll('.rod__header');
	// 	if (!target_els.length) return null;
	// 	return Array.from(target_els, (header_el, header_idx) => new Interaction_RodHeaders_ScrollAnim(this, header_el, header_idx));
	// }
	
	// - - - Floating Img Section Interaction - - - 
	// getFloatingImgSections() {
	// 	const target_els = document.querySelectorAll('.floating-img-section');
	// 	return Array.from(target_els).map(el => new Interaction_FloatingImgSection(this, el));
	// }

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
		if (this.rod_headers_scroll) {
			this.rod_headers_scroll.forEach((interaction) => interaction.destroy());
			this.rod_headers_scroll = null;
		}
		this.gsap_ctx.revert();
	}
}
