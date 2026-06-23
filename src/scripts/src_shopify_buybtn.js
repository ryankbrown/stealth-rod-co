const SRC_SHOPIFY_GOOGLE_FONTS = ["Bebas Neue"];


const SRC_RED = "#D3242B";
const SRC_DARK_RED = "#94141A";

const SRC_SHOPIFY_BUTTON_FONT = {
	"font-family": "Bebas Neue, Helvetica, Arial, sans-serif",
	"font-size": "clamp(1.3rem, 1.32rem + 0.2618vw, 1.8rem)",
	"letter-spacing": "0.08rem",
	"line-height": "1",
};

const SRC_SHOPIFY_SOLID_BTN_COLORS = {
	"background-color": SRC_RED,
	color: "#FFFFFF",
	scale: "1.05",
	"border-color": SRC_RED,
	":hover": {
		"background-color": SRC_DARK_RED,
		color: "#FFFFFF",
		scale: "1.05",
		"border-color": SRC_DARK_RED,
	},
	":focus": {
		"background-color": SRC_DARK_RED,
		color: "#FFFFFF",
		scale: "1.05",
		"border-color": SRC_DARK_RED,
	},
};

const SRC_SHOPIFY_LINED_BTN_COLORS = {
	"background-color": "transparent",
	"border-width": "1px",
	"border-style": "solid",
	"border-color": "#6d6e72",
	color: "#6d6e72",
	transition: "all 0.3s ease-in-out",
	scale: "1",
	"border-radius": "0px",
	":hover": {
		"background-color": SRC_RED,
		color: "#FFFFFF",
		scale: "1.05",
		"border-color": SRC_RED,
	},
	":focus": {
		"background-color": SRC_RED,
		color: "#FFFFFF",
		scale: "1.05",
		"border-color": SRC_RED,
	},
};


const SRC_SHOPIFY_TOGGLE ={ 
	...SRC_SHOPIFY_BUTTON_FONT,
	...SRC_SHOPIFY_SOLID_BTN_COLORS,
	"border-radius": "0px",
	"padding-top": "15px",
	"padding-bottom": "15px",
}

const SRC_SHOPIFY_PRODUCT_BUTTON = {
	...SRC_SHOPIFY_BUTTON_FONT,
	...SRC_SHOPIFY_LINED_BTN_COLORS,
	
	padding: "0px",
	width: "100%",
	height: "100%",
	display: "flex",
	"justify-content": "center",
	"align-items": "center",
	":disabled": {
		"background-color": "transparent",
		opacity: ".5",
		"font-size": "clamp(1.2rem, 1.1509rem + 0.2182vw, 1.5rem)",
	},
	":hover": {
		"border-radius": "none",
		"border-color": SRC_RED,
		"background-color": SRC_RED,
		"color": "white"
	},
	":focus": {
		"border-radius": "none",
		"border-color": SRC_RED,
		"background-color": SRC_RED,
		"outline" : "red",
		"color": "white"
	},
};


const SRC_SHOPIFY_CHECKOUT_BUTTON = {
	...SRC_SHOPIFY_BUTTON_FONT,
	...SRC_SHOPIFY_SOLID_BTN_COLORS,
	"border-radius": "0px",
	"padding-top": "15px",
	"padding-bottom": "15px",
	"padding-left": "25px",
	"padding-right": "25px",
}

const SRC_SHOPIFY_ACTION_BUTTON = {
	...SRC_SHOPIFY_BUTTON_FONT,
	...SRC_SHOPIFY_LINED_BTN_COLORS,
	"padding-top": "15px",
	"padding-bottom": "15px",
	"padding-left": "25px",
	"padding-right": "25px",
};

const SRC_SHOPIFY_CART_TEXT_COLOR = "#6d6e72";

function getShopifyBuyOptions() {
	return {
		product: {
			text: {
				button: "Add to cart",
				outOfStock: "Out of Stock",
			},
			contents: {
				img: false,
				title: false,
				price: false,
			},
			googleFonts: SRC_SHOPIFY_GOOGLE_FONTS,
			styles: {
				buttonWrapper: {
					"margin-top": "0px",
					height: "100%",
				},
				button: SRC_SHOPIFY_PRODUCT_BUTTON,
			},
		},
		modalProduct: {
			contents: {
				img: false,
				imgWithCarousel: true,
				button: false,
				buttonWithQuantity: true,
			},
			googleFonts: SRC_SHOPIFY_GOOGLE_FONTS,
			text: {
				button: "Add to cart",
			},
			styles: {
				button: SRC_SHOPIFY_ACTION_BUTTON,
				quantityInput: {
					"font-size": "clamp(1.2rem, 1.1509rem + 0.2182vw, 1.5rem)",
					"padding-top": "15px",
					"padding-bottom": "15px",
				},
			},
		},
		cart: {
			popup: false,
			googleFonts: SRC_SHOPIFY_GOOGLE_FONTS,
			text: {
				title: "Your Cart",
				total: "Subtotal",
				button: "Checkout",
			},
			styles: {
				button: SRC_SHOPIFY_CHECKOUT_BUTTON,
				title: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				header: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				lineItems: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				subtotalText: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				subtotal: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				notice: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				currency: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				close: {
					color: SRC_SHOPIFY_CART_TEXT_COLOR,
					":hover": { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				},
				empty: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				noteDescription: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				discountText: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				discountIcon: { fill: SRC_SHOPIFY_CART_TEXT_COLOR },
				discountAmount: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
			},
		},
		toggle: {
			googleFonts: SRC_SHOPIFY_GOOGLE_FONTS,
			styles: {
				toggle: SRC_SHOPIFY_TOGGLE,
				count: {
					"font-size": "clamp(1.2rem, 1.1509rem + 0.2182vw, 1.5rem)",
				},
			},
		},
		lineItem: {
			styles: {
				variantTitle: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				title: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				price: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				fullPrice: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				discount: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				discountIcon: { fill: SRC_SHOPIFY_CART_TEXT_COLOR },
				quantity: { color: SRC_SHOPIFY_CART_TEXT_COLOR },
				quantityIncrement: {
					color: SRC_SHOPIFY_CART_TEXT_COLOR,
					// "border-color": SRC_SHOPIFY_CART_TEXT_COLOR,
				},
				quantityDecrement: {
					color: SRC_SHOPIFY_CART_TEXT_COLOR,
					// "border-color": SRC_SHOPIFY_CART_TEXT_COLOR,
				},
				quantityInput: {
					color: SRC_SHOPIFY_CART_TEXT_COLOR,
					// "border-color": SRC_SHOPIFY_CART_TEXT_COLOR,
				},
			},
		},
	};
}

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

		const shopifyOptions = getShopifyBuyOptions();

		ShopifyBuy.UI.onReady(client).then(function (ui) {
			const shopify_buttons = document.querySelectorAll(
				"[data-shopify-product-id]"
			);

			if (shopify_buttons.length > 0) {
				shopify_buttons.forEach((el) => {
					const productId = el.getAttribute("data-shopify-product-id");

					if (productId !== undefined) {
						ui.createComponent("product", {
							id: productId,
							node: el,
							moneyFormat: "%24%7B%7Bamount%7D%7D",
							options: shopifyOptions,
						});
					}
				});
			}
		});
	}
}
