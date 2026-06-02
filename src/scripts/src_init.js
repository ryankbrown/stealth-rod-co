// Stealth Rod Co — Webflow

import { SRC_ShopifyBuyBtn } from './src_shopify_buybtn.js';
import SRC_App from './src_app.js';

document.addEventListener("DOMContentLoaded", (event) => {
	
	console.log("SRC - DOMContentLoaded");
	
	console.log('SRC - Initializing Shopify Buy Button Code');
	if ( typeof SRC_ShopifyBuyBtn === 'function' ) {
		SRC_ShopifyBuyBtn();
	} else {
		console.error('SRC_ShopifyBuyBtn is not a function');
	}

	gsap.registerPlugin(
		ScrollTrigger,
		ScrollSmoother,
		// ScrollToPlugin,
		SplitText
	)
	
	// - - - Initialize SRC App - - -
	
	window.stealth_rod_co_app = new SRC_App();
	console.log("SRC - End SRC Code")
});