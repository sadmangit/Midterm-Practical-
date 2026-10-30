# TechNova — Student E-commerce Website

A responsive three-page website built with plain HTML, CSS, and JavaScript for a web development midterm.

## Files
- `index.html` — Home page; includes a Flexbox layout.
- `products.html` — Products page; includes a CSS Grid layout.
- `contact.html` — Contact page; includes a demo contact form.
- `style.css` — Shared styling and responsive layout.
- `script.js` — JavaScript button and form interactions.

## Before submitting
1. Replace `REPLACE_WITH_YOUR_ID` in the HTML comment immediately after the opening `<body>` tag in all three HTML files with your actual student ID.
2. Open `index.html` in a browser and test the navigation, images, buttons, and form.
3. Product images use remote Unsplash image URLs, so an internet connection is needed to load them.
4. Product names and prices are examples. No checkout or backend is implemented.
5. Create your own GitHub repository, commit your actual work regularly, and deploy the repository on Netlify.

## Run locally
Open `index.html` in a browser. No build command or package installation is required.


## Cart and checkout
- Add products to the cart on `products.html`.
- Change quantities or remove items before checkout.
- Submit delivery details to create a local order record and download a text receipt.
- The cart, orders, and contact messages are stored in the current browser using `localStorage`.

Important: this is a browser-side checkout flow. It does not send orders to a store owner, run a shared database, or process payments. A real public store needs a backend/API and secure order storage; payment processing additionally needs a payment provider.
