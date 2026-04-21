// Stealth Rod Co — Webflow JS entry
// Import modules here, e.g.:
// import { initNav } from './modules/nav.js';

document.addEventListener('DOMContentLoaded', () => {
	console.log('Stealth Rod Co Custom Global JS Loaded') ;
	
	const main_nav_btn = document.querySelector('.main-nav__btn');
	const main_nav = document.querySelector('.main-nav');
	
	main_nav_btn.addEventListener('click', () => {
		if ( !main_nav.classList.contains('is-active') ) {
			console.log('activating main nav')
			main_nav.classList.remove('is-not-active');
			main_nav.classList.add('is-active');
		} else {
			console.log('deactivating main nav')
			main_nav.classList.remove('is-active');
			main_nav.classList.add('is-not-active');
		}
	});
});
