// TechNova shopping cart and checkout interactions. Orders are stored in this browser only.
const PRODUCTS = {
  "NovaSound Headphones": 3500,
  "NovaFit Smartwatch": 4200,
  "NovaBook Laptop": 58000,
  "NovaBuds Earbuds": 2200,
  "NovaGlide Mouse": 950,
  "NovaTab Tablet": 15000
};

function exploreProducts() {
  window.location.href = "products.html";
}

function showStoreMessage() {
  alert("TechNova offers everyday gadgets for work, entertainment, and life on the go.");
}

function readCart() {
  try { return JSON.parse(localStorage.getItem("technovaCart") || "[]"); }
  catch (error) { return []; }
}

function saveCart(cart) {
  localStorage.setItem("technovaCart", JSON.stringify(cart));
}

function addToCart(productName, price) {
  const cart = readCart();
  const item = cart.find(product => product.name === productName);
  if (item) item.quantity += 1;
  else cart.push({ name: productName, price: Number(price || PRODUCTS[productName] || 0), quantity: 1 });
  saveCart(cart);
  renderCart();
  const cartSection = document.getElementById("cart-checkout");
  if (cartSection) cartSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function changeQuantity(productName, change) {
  const cart = readCart().map(item => item.name === productName ? { ...item, quantity: item.quantity + change } : item)
    .filter(item => item.quantity > 0);
  saveCart(cart);
  renderCart();
}

function removeFromCart(productName) {
  saveCart(readCart().filter(item => item.name !== productName));
  renderCart();
}

function formatMoney(amount) {
  return "৳ " + Number(amount).toLocaleString("en-BD");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = readCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-count").textContent = `${totalQuantity} ${totalQuantity === 1 ? "ITEM" : "ITEMS"}`;
  document.getElementById("cart-total").textContent = formatMoney(total);
  if (!cart.length) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty. Add a product above to get started.</p>';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div class="cart-product"><strong>${escapeHTML(item.name)}</strong><span>${formatMoney(item.price)} each</span></div>
      <div class="quantity-controls"><button type="button" aria-label="Decrease ${escapeHTML(item.name)} quantity" onclick="changeQuantity('${escapeJS(item.name)}', -1)">−</button><span>${item.quantity}</span><button type="button" aria-label="Increase ${escapeHTML(item.name)} quantity" onclick="changeQuantity('${escapeJS(item.name)}', 1)">+</button></div>
      <strong class="cart-line-total">${formatMoney(item.price * item.quantity)}</strong>
      <button type="button" class="remove-item" onclick="removeFromCart('${escapeJS(item.name)}')">Remove</button>
    </div>`).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function escapeJS(value) { return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'"); }

function placeOrder(event) {
  event.preventDefault();
  const cart = readCart();
  if (!cart.length) {
    alert("Your cart is empty. Add at least one product before placing an order.");
    return;
  }
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const orderNumber = "TN" + Date.now().toString().slice(-8);
  const order = {
    orderNumber,
    customer: {
      name: document.getElementById("customer-name").value.trim(),
      phone: document.getElementById("customer-phone").value.trim(),
      address: document.getElementById("customer-address").value.trim(),
      email: document.getElementById("customer-email").value.trim(),
      paymentMethod: document.getElementById("payment-method").value
    },
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    createdAt: new Date().toISOString(),
    status: "Order placed"
  };
  const orders = JSON.parse(localStorage.getItem("technovaOrders") || "[]");
  orders.push(order);
  localStorage.setItem("technovaOrders", JSON.stringify(orders));
  saveCart([]);
  renderCart();
  form.reset();
  const confirmation = document.getElementById("order-confirmation");
  confirmation.hidden = false;
  confirmation.innerHTML = `<h3>Order placed successfully</h3><p>Thank you, ${escapeHTML(order.customer.name)}. Your order reference is <strong>${order.orderNumber}</strong>.</p><p><strong>Total:</strong> ${formatMoney(order.total)} · <strong>Payment:</strong> Cash on delivery</p><p>Your order details have been saved in this browser. For a real online store, order data must be sent to a server or store owner's order-management system.</p><button class="btn btn-outline" type="button" onclick="downloadOrderReceipt('${order.orderNumber}')">Download receipt</button>`;
  confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
}

function downloadOrderReceipt(orderNumber) {
  const orders = JSON.parse(localStorage.getItem("technovaOrders") || "[]");
  const order = orders.find(item => item.orderNumber === orderNumber);
  if (!order) { alert("Order receipt was not found in this browser."); return; }
  const lines = [
    "TECHNOVA ORDER RECEIPT", `Order: ${order.orderNumber}`, `Date: ${new Date(order.createdAt).toLocaleString()}`,
    `Customer: ${order.customer.name}`, `Phone: ${order.customer.phone}`, `Address: ${order.customer.address}`,
    `Payment: ${order.customer.paymentMethod}`, "", "ITEMS",
    ...order.items.map(item => `${item.name} x ${item.quantity} — ${formatMoney(item.price * item.quantity)}`),
    "", `TOTAL: ${formatMoney(order.total)}`, "Status: Order placed"
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = `${order.orderNumber}-receipt.txt`; link.click();
  URL.revokeObjectURL(url);
}

function submitContactForm(event) {
  event.preventDefault();
  const customerName = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!customerName || !message) { alert("Please complete all required fields."); return; }
  const messages = JSON.parse(localStorage.getItem("technovaMessages") || "[]");
  messages.push({ name: customerName, email: document.getElementById("email").value.trim(), topic: document.getElementById("topic").value, message, createdAt: new Date().toISOString() });
  localStorage.setItem("technovaMessages", JSON.stringify(messages));
  alert("Thank you, " + customerName + ". Your message has been saved in this browser.");
  event.target.reset();
}

document.addEventListener("DOMContentLoaded", renderCart);
