// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Demo cart button (replace later with real logic)
const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
  let count = 0;
  cartBtn.addEventListener('click', () => {
    count++;
    alert(`Cart demo: ${count} items`);
    cartBtn.setAttribute('aria-label', `Open cart (${count} items)`);
  });
}