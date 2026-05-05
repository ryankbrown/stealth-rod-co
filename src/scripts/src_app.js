// src_app.js - Stealth Rod Co - Application Class

import { SRC_ShopifyBuyBtn } from './src_shopify_buybtn.js';

import Interaction_UpdateLoop from './interaction_update-loop.js';
import Interaction_NavController from './interaction_nav-controller.js';
import Interaction_SmoothScroll from './interaction_smooth-scroll.js';
import Interaction_ViewportObserver from './interaction_smooth-scroll.js'
import Interaction_FixedContentStyler from './interaction_fixed-content-styler'


// - - - SRC Site JS App Class - - - 
export default class SRC_App {
	constructor() {
		// Main GSAP Context
		this.gsap_ctx = gsap.context(() => {});
		this.update_loop = new Interaction_UpdateLoop();
		this.init();
	}
	init() {
		// Global Interactions
		this.src_smooth_scroll = new Interaction_SmoothScroll(this);
		this.src_nav_controller = new Interaction_NavController(this);
		this.src_viewport_observer = this.getViewportObserver();
		this.src_fixed_content_styler = this.getFixedContentStyler();
		
		// Component Interactions
		// this.src_background_video = this.getBackgroundVideo();
		// this.src_floating_img_sections = this.getFloatingImgSections();
		// this.src_sidescrollers = this.getSidescrollers();
		// this.src_project_sidescrollers = this.getProjectSidescrollers();
		// this.src_crossfaders = this.getCrossfaders();
		// this.src_bio_overlays = this.getBioOverlays();
		// this.src_craft_scrollsects = this.getCraftScrollSects();
	}

	getViewportObserver() {
		const target_els = document.querySelectorAll('[data-detect-in-view]');
		if (!target_els.length) return null;
		return new Interaction_ViewportObserver(this, target_els);
	}
	getFixedContentStyler() {
		const target_els = document.querySelectorAll('[data-fixed-content-styles]');
		if (!target_els.length) return null;
		return new Interaction_FixedContentStyler(this, target_els, this.update_loop);
	}
	
	// - - - Floating Img Section Interaction - - - 
	// getFloatingImgSections() {
	// 	const target_els = document.querySelectorAll('.floating-img-section');
	// 	return Array.from(target_els).map(el => new Interaction_FloatingImgSection(this, el));
	// }

	destroyGlobalInteractions() {
		if (this.src_viewport_observer) {
			this.src_viewport_observer.destroy();
			this.src_viewport_observer = null;
		}
		if (this.src_fixed_content_styler) {
			this.src_fixed_content_styler.destroy();
			this.src_fixed_content_styler = null;
		}
		if (this.src_nav_controller) {
			// currently only partially cleans up, but call destroy for parity
			this.src_nav_controller.destroy();
			this.src_nav_controller = null;
		}
		// Smooth scroll is created inside the GSAP context; letting
		// gsap_ctx.revert() handle its teardown keeps responsibilities clear.
		this.fb_smooth_scroll = null;
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
		this.gsap_ctx.revert();
	}
}
