import { Interaction_ParallaxLayer, Interaction_ParallaxContainer } from "./interaction_parallax-stack-gsap";

export default class Interaction_NavController {
	constructor(app) {
		this.app = app;
		this.is_active = false;
		this.main_nav = document.querySelector(".main-nav");
		this.nav_overlay = document.querySelector(".main-nav__overlay");
		this.menu_btn = document.querySelector(".main-nav__btn");
		
		this.nav_items = document.querySelectorAll(".main-nav__item");
		this.nav_links = document.querySelectorAll(".main-nav__link");
		this.nav_item_wrapper = document.querySelector(".main-nav__item-wrapper");
		
		this.nav_bg_img = document.querySelectorAll(".main-nav__bg-img");

		this.handleNavExpand = this.handleNavExpand.bind(this);
		// this.handleNavItemHover = this.handleNavItemHover.bind(this);
		// this.handleNavItemLeave = this.handleNavItemLeave.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		
		// Setup Event Listener
		this.init();
	}
	
	init() {
		
		if (this.is_active) {
			this.activateNav();
		} else {
			this.deactivateNav();
		}
		
		this.setupEventListeners();
		// this.setCurrentPg();
		this.setupParallax();
	}
	
	// setCurrentPg() {
	// 	this.nav_links.forEach(link => {
	// 		link.classList.remove("current-pg-link");
	// 	});
		
	// 	const current_pg = document.body.getAttribute("data-pg");
		
	// 	if (!current_pg) return;
		
	// 	const current_pg_link = document.querySelector(`.main-nav__link[href="/${current_pg}"]`);
	// 	if (current_pg_link) current_pg_link.classList.add("current-pg-link");
		
	// }
	
	activateNav() {
		this.is_active = true;
		this.main_nav.classList.add("is-active");
		this.main_nav.classList.remove("is-not-active");
		document.body.classList.add("no-scroll");
		
		
		if (this.app.src_smooth_scroll) {
			this.app.src_smooth_scroll.smooth_scroller.paused(true);
		}
		if (this.parallax_container) {
			this.parallax_container.resume();
		}
		if (this.app.site_headers_parallax) {
			this.app.site_headers_parallax.forEach((parallax) => parallax.resume());
		}
	}
	
	deactivateNav() {
		this.is_active = false;
		this.main_nav.classList.remove("is-active");
		this.main_nav.classList.add("is-not-active");
		document.body.classList.remove("no-scroll");
		
		if (this.app.src_smooth_scroll) {
			this.app.src_smooth_scroll.smooth_scroller.paused(false);
		}
		if (this.parallax_container) {
			this.parallax_container.pause();
		}
		if (this.app.site_headers_parallax) {
			this.app.site_headers_parallax.forEach((parallax) => parallax.pause());
		}
	}
	
	setupEventListeners() {
		// Event Listener for Menu Button Click
		this.menu_btn.addEventListener("click", this.handleNavExpand);
		
		// Event Listener for Nav Items Hover
		// this.nav_items.forEach(item => {
		// 	item.addEventListener("mouseenter", this.handleNavItemHover);
		// 	item.addEventListener("mouseleave", this.handleNavItemLeave);
		// });

		document.addEventListener("keydown", this.handleKeydown);
	}

	// handleNavItemHover(e) {
	// 	const hoverd_item = e.currentTarget;
	// 	const label = hoverd_item.getAttribute("data-nav-label");
		
	// 	hoverd_item.classList.add("is-hovered");
	// 	const bg_img = document.querySelector(`.main-nav__bg-img[data-nav-label="${label}"]`);
		
	// 	if (bg_img) bg_img.classList.add("is-active");
	// }

	// handleNavItemLeave() {
	// 	this.nav_items.forEach((item) => item.classList.remove("is-hovered"));
	// 	this.nav_bg_imgs.forEach((img) => img.classList.remove("is-active"));
	// }
	
	setupParallax() {
		// BG Image Layer
		const bg_img_layer = new Interaction_ParallaxLayer({
			layer_el: '.main-nav__overlay-bg-img',
			options: {
				lerp_amt: 0.1,
				move_rate: { x: 0.01, y: 0.01 },
				clamp_offset: {
					min_x: -50,
					max_x: 50,
					min_y: -50,
					max_y: 50,
				}
			},
		});
		

		this.parallax_container = new Interaction_ParallaxContainer({
			app: this.app,
			layer_items: [ bg_img_layer ],
			container_el: this.nav_overlay,
			container_id: `main-nav--parallax-elements`,
			update_loop: this.app.update_loop,
			relative_el: this.nav_overlay.querySelector('.main-nav__overlay-wrapper')
		});
		
		this.parallax_container.pause();
	}
	
	handleNavExpand() {
		if ( this.is_active ) {
			this.deactivateNav();
		} else {
			this.activateNav();
		}
	}

	handleKeydown(e) {
		if (e.key !== "Escape") return;
		if (!this.nav_overlay.classList.contains("active")) return;
		this.handleNavExpand();
	}

	destroy() {
		
		if (this.menu_btn && this.handleNavExpand) {
			this.menu_btn.removeEventListener("click", this.handleNavExpand);
		}
		document.removeEventListener("keydown", this.handleKeydown);
		if (this.parallax_container) {
			this.parallax_container.destroy();
			this.parallax_container = null;
		}
	}
}


