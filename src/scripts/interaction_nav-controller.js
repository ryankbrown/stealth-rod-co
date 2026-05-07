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
		
	}
	
	deactivateNav() {
		this.is_active = false;
		this.main_nav.classList.remove("is-active");
		this.main_nav.classList.add("is-not-active");
		document.body.classList.remove("no-scroll");
		
		if (this.app.src_smooth_scroll) {
			this.app.src_smooth_scroll.smooth_scroller.paused(false);
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
	}
}


