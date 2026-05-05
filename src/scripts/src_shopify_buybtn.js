export function SRC_ShopifyBuyBtn() {
	var scriptURL =
		"https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
	if (window.ShopifyBuy) {
		if (window.ShopifyBuy.UI) {
			ShopifyBuyInit();
		} else {
			loadScript();
		}
	} else {
		loadScript();
	}

	function loadScript() {
		var script = document.createElement("script");
		script.async = true;
		script.src = scriptURL;
		(
			document.getElementsByTagName("head")[0] ||
			document.getElementsByTagName("body")[0]
		).appendChild(script);
		script.onload = ShopifyBuyInit;
	}

	function ShopifyBuyInit() {
		var client = ShopifyBuy.buildClient({
			domain: "stealth-rod-co.myshopify.com",
			storefrontAccessToken: "25e80aa3117c6c5dfbd6a160b435f9a5",
		});

		ShopifyBuy.UI.onReady(client).then(function (ui) {
			// SRC - Looping code
			const shopify_buttons = document.querySelectorAll("[data-shopify-product-id]");

			if (shopify_buttons.length > 0) {
				// SRC - Start of shopify_buttons loop
				shopify_buttons.forEach((el) => {
					
					// SRC - Look for each Webflow product card Buy Button wrapper via the data-shopify-product-id attribute
					const productId = el.getAttribute("data-shopify-product-id");
					
					if (productId !== undefined) {
						ui.createComponent("product", {
							// id: '14960540811627',
							id: productId,
							node: el,
							moneyFormat: "%24%7B%7Bamount%7D%7D",
							options: {
								"product": {
									"text": {
										"button": "Buy",
										"outOfStock": "Out of Stock"
									},
									
									"buttonDestination": "checkout",
									"contents": {
										"img": false,
										"title": false,
										"price": false
									},
									"googleFonts": [
										"Bebas Neue"
									],
									"styles": {
										"buttonWrapper": {
											"margin-top": "0px",
											// "height": "clamp(2.0736rem, 1.9888rem + 0.377vw, 2.592rem)"
											"height": "100%"
										},
										"button": {
											"font-family": "Bebas Neue, Helvetica, Arial, sans-serif",
											"font-size": "clamp(1.44rem, 1.3811rem + 0.2618vw, 1.8rem)",
											"letter-spacing": "0.08rem",
											"line-height": "1",
											
											"padding": "0px",
											"background-color": "transparent",
											
											"border-width": "1px",
											"border-style": "solid",
											"border-color": "#6d6e72",
											
											"color": "#6d6e72",
											"transition": "all 0.3s ease-in-out",
											"scale": "1",
											
											"width": "100%",
											"height": "100%",
											
											"display": "flex",
											"justify-content": "center",
											"align-items": "center",
											"border-radius": "0px",
											
											":hover": {
												"background-color": "#D3242B",
												"color": "#FFFFFF",
												"scale": "1.05",
												"border-color": "#D3242B",
											},
											
											":focus": {
												"background-color": "#D3242B",
												"color": "#FFFFFF",
												"scale": "1.05",
												"border-color": "#D3242B",
											},
											// Disabled Styles
											":disabled" : {
												"background-color": "transparent",
												"opacity": ".5",
												"font-size": "clamp(1.2rem, 1.1509rem + 0.2182vw, 1.5rem)"
											}
										},
									}
								},
								"cart": {
									"popup": false,
								}
							},
						});
					}
					// SRC - End of shopify_buttons loop
				});
			}
		});
	}
}