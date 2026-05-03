/*<![CDATA[*/
(function () {
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
			domain: "34gzpi-cg.myshopify.com",
			storefrontAccessToken: "25e80aa3117c6c5dfbd6a160b435f9a5",
		});

		ShopifyBuy.UI.onReady(client).then(function (ui) {
			
			// RKB - Looping code
			const shopify_buttons = document.querySelectorAll("[data-shopify-product-id]");

			if (shopify_buttons.length > 0) {
				
				// RKB - Start of shopify_buttons loop
				shopify_buttons.forEach((el) => {
					const productId = el.getAttribute("data-shopify-product-id");
					
					if (productId !== undefined) {
						ui.createComponent("product", {
						id: 14960540811627,
						node: el,
						moneyFormat: "%24%7B%7Bamount%7D%7D",
						options: {
							product: {
								contents: {
									img: false,
									title: false,
									price: false,
								},
								styles: {
									button: {
										"font-family":
											"Bebas Neue, Droid Sans, sans-serif",
										"font-size":
											"clamp(1.44rem, 1.3811rem + .2618vw, 1.8rem)",
										"padding-top": "15px",
										"padding-bottom": "15px",
										"margin-top": "0px",
										":hover": {
											"background-color": "#FF3F47",
										},
										"background-color": "#D3242B",
										":focus": {
											"background-color": "#FF3F47",
										},
										"border-radius": "0px",
									},
									quantityInput: {
										"font-size": "14px",
										"padding-top": "15px",
										"padding-bottom": "15px",
									},
								},
								text: {
									button: "BUY",
								},
								googleFonts: ["Bebas Neue"],
							},
							productSet: {
								styles: {
									products: {
										"@media (min-width: 601px)": {
											"margin-left": "-20px",
										},
									},
								},
							},
							modalProduct: {
								contents: {
									img: false,
									imgWithCarousel: true,
									button: false,
									buttonWithQuantity: true,
								},
								styles: {
									product: {
										"@media (min-width: 601px)": {
											"max-width": "100%",
											"margin-left": "0px",
											"margin-bottom": "0px",
										},
									},
									button: {
										"font-family":
											"Bebas Neue, Droid Sans, sans-serif",
										"font-size": "14px",
										"padding-top": "15px",
										"padding-bottom": "15px",
										":hover": {
											"background-color": "#FF3F47",
										},
										"background-color": "#D3242B",
										":focus": {
											"background-color": "#FF3F47",
										},
										"border-radius": "0px",
									},
									quantityInput: {
										"font-size": "14px",
										"padding-top": "15px",
										"padding-bottom": "15px",
									},
								},
								googleFonts: ["Bebas Neue"],
								text: {
									button: "Add to cart",
								},
							},
							option: {},
							cart: {
								styles: {
									button: {
										"font-family":
											"Bebas Neue, Droid Sans, sans-serif",
										"font-size": "14px",
										"padding-top": "15px",
										"padding-bottom": "15px",
										":hover": {
											"background-color": "#FF3F47",
										},
										"background-color": "#D3242B",
										":focus": {
											"background-color": "#FF3F47",
										},
										"border-radius": "0px",
									},
								},
								text: {
									total: "Subtotal",
									button: "Checkout",
								},
								googleFonts: ["Bebas Neue"],
							},
							toggle: {
								styles: {
									toggle: {
										"font-family":
											"Bebas Neue, Droid Sans, sans-serif",
										"background-color": "#D3242B",
										":hover": {
											"background-color": "#FF3F47",
										},
										":focus": {
											"background-color": "#FF3F47",
										},
									},
									count: {
										"font-size": "14px",
									},
								},
								googleFonts: ["Bebas Neue"],
							},
						},
					});
					}
					// RKB - End of shopify_buttons loop
				});
			}
		});
	}
})();
/*]]>*/