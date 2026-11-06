/**
 * KOLT KASE INC - FLAGSHIP STORE INTERACTIVE ENGINE
 * Apple-Level Micro-Interactions, Scroll Reveal, Cart Drawer & Customizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Scroll-Reveal Intersection Observer
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-init');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // Ensure hero content and top strip reveal immediately
  const heroContent = document.querySelector('.hero-content');
  const valueStrip = document.querySelector('.value-strip-container');
  if (heroContent) setTimeout(() => heroContent.classList.add('revealed'), 100);
  if (valueStrip) setTimeout(() => valueStrip.classList.add('revealed'), 250);

  // =========================================================================
  // 2. Header Scroll Glassmorphic Transition
  // =========================================================================
  const globalHeader = document.getElementById('globalHeader');
  
  const handleScroll = () => {
    if (window.scrollY > 25) {
      globalHeader.classList.add('scrolled');
    } else {
      globalHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 3. Hero 3D Parallax & Depth Tilt
  // =========================================================================
  const heroSection = document.getElementById('hero');
  const productShowcase = document.getElementById('productShowcase');
  const ambientGlow = document.querySelector('.hero-ambient-glow');
  const ambientGlowSec = document.querySelector('.hero-ambient-glow-secondary');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && heroSection && productShowcase) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
      const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX = xPercent * 16;
      mouseY = yPercent * 16;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    const animateDepth = () => {
      currentX = lerp(currentX, mouseX, 0.08);
      currentY = lerp(currentY, mouseY, 0.08);

      if (productShowcase) {
        productShowcase.style.transform = `perspective(1000px) rotateY(${currentX * 0.75}deg) rotateX(${-currentY * 0.75}deg)`;
      }

      if (ambientGlow) {
        ambientGlow.style.transform = `translate(${currentX * 1.5}px, ${currentY * 1.5}px)`;
      }

      if (ambientGlowSec) {
        ambientGlowSec.style.transform = `translate(${-currentX * 1.2}px, ${-currentY * 1.2}px)`;
      }

      requestAnimationFrame(animateDepth);
    };

    animateDepth();
  }

  // =========================================================================
  // 4. Product Catalog Category Filter Tabs
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      productCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 5. Live Customizer Studio (Section 5)
  // =========================================================================
  const studioMockupImg = document.getElementById('studioMockupImg');
  const studioEngravingText = document.getElementById('studioEngravingText');
  const monogramInput = document.getElementById('monogramInput');
  const studioSwatches = document.querySelectorAll('.studio-swatch-btn');
  const studioAddBtn = document.getElementById('studioAddBtn');

  let activeMaterial = 'Carbon Fiber';
  let activeMockupSrc = 'assets/images/case-carbon-fiber.svg';

  // Live Monogram Typing
  if (monogramInput && studioEngravingText) {
    monogramInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toUpperCase();
      studioEngravingText.textContent = val || 'KOLT';
    });
  }

  // Material Swatches Switcher
  studioSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      studioSwatches.forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');

      const imgSrc = swatch.getAttribute('data-src');
      const material = swatch.getAttribute('data-material');

      activeMaterial = material;
      activeMockupSrc = imgSrc;

      if (studioMockupImg) {
        studioMockupImg.style.transform = 'scale(0.92) rotate(-2deg)';
        setTimeout(() => {
          studioMockupImg.src = imgSrc;
          studioMockupImg.style.transform = 'scale(1) rotate(0deg)';
        }, 160);
      }

      if (studioEngravingText) {
        if (material === 'Desert Sand') {
          studioEngravingText.style.color = '#0D263B';
          studioEngravingText.style.textShadow = 'none';
        } else {
          studioEngravingText.style.color = 'rgba(255, 255, 255, 0.9)';
          studioEngravingText.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.9)';
        }
      }
    });
  });

  // =========================================================================
  // 6. Shopping Bag & Slide-out Cart Drawer System
  // =========================================================================
  const cartOverlay = document.getElementById('cartOverlay');
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const cartHeaderCount = document.getElementById('cartHeaderCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalAmount = document.getElementById('cartSubtotalAmount');
  const shippingMeterText = document.getElementById('shippingMeterText');
  const shippingProgressFill = document.getElementById('shippingProgressFill');
  const checkoutBtn = document.getElementById('checkoutBtn');

  let cart = [];
  const FREE_SHIPPING_THRESHOLD = 50.0;

  const openCart = () => {
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  // Render Cart UI
  const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartBadgeCount) cartBadgeCount.textContent = totalItems;
    if (cartHeaderCount) cartHeaderCount.textContent = totalItems;
    if (cartSubtotalAmount) cartSubtotalAmount.textContent = `$${subtotal.toFixed(2)}`;

    // Free Shipping Progress
    if (shippingProgressFill && shippingMeterText) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingProgressFill.style.width = '100%';
        shippingMeterText.textContent = '🎉 You have unlocked Free Worldwide Express Shipping!';
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
        const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
        shippingProgressFill.style.width = `${progressPct}%`;
        shippingMeterText.textContent = `Add $${remaining} more for Free Worldwide Express Shipping!`;
      }
    }

    // Render Items
    if (cartItemsList) {
      if (cart.length === 0) {
        cartItemsList.innerHTML = `
          <div class="cart-empty-msg">
            <p>Your bag is currently empty.</p>
            <p style="margin-top: 0.5rem; font-size: 0.8rem;">Explore our best-sellers to equip your phone.</p>
          </div>
        `;
      } else {
        cartItemsList.innerHTML = cart.map((item, index) => `
          <div class="cart-item">
            <img src="${item.img}" alt="${item.title}" class="cart-item-thumb">
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.title}</h4>
              <p class="cart-item-meta">${item.finish} ${item.customText ? `&middot; Engraving: "${item.customText}"` : ''}</p>
              <div class="cart-qty-row">
                <div class="qty-pill">
                  <button class="qty-btn" onclick="window.changeCartQty(${index}, -1)" aria-label="Decrease quantity">&minus;</button>
                  <span class="qty-count">${item.quantity}</span>
                  <button class="qty-btn" onclick="window.changeCartQty(${index}, 1)" aria-label="Increase quantity">&plus;</button>
                </div>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="cart-item-remove" onclick="window.removeCartItem(${index})">Remove</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  };

  const addItemToCart = (item) => {
    const existingIndex = cart.findIndex(
      (c) => c.title === item.title && c.finish === item.finish && c.customText === item.customText
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    updateCartUI();
    openCart();

    if (cartOpenBtn) {
      cartOpenBtn.style.transform = 'scale(1.18)';
      setTimeout(() => {
        cartOpenBtn.style.transform = '';
      }, 220);
    }
  };

  window.changeCartQty = (index, delta) => {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  };

  window.removeCartItem = (index) => {
    if (!cart[index]) return;
    cart.splice(index, 1);
    updateCartUI();
  };

  // Bind Add-to-Bag buttons on Product Cards
  const addButtons = document.querySelectorAll('.card-btn-add');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const price = parseFloat(btn.getAttribute('data-price')) || 54.0;
      const img = btn.getAttribute('data-img');
      const finish = btn.getAttribute('data-finish');

      addItemToCart({
        title,
        price,
        img,
        finish,
        customText: ''
      });
    });
  });

  // Bind Customizer Add Button
  if (studioAddBtn) {
    studioAddBtn.addEventListener('click', () => {
      const engraving = monogramInput ? monogramInput.value.trim().toUpperCase() : 'KOLT-01';
      addItemToCart({
        title: 'Custom Laser Monogram Case',
        price: 64.0,
        img: activeMockupSrc,
        finish: activeMaterial,
        customText: engraving || 'KOLT'
      });
    });
  }

  // Checkout Button Trigger
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your shopping bag is empty. Please select a case before checkout.');
        return;
      }
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      alert(`Dispatching Order to Kolt Express Fulfillment Center!\nTotal: $${subtotal.toFixed(2)}\n\nThank you for choosing Kolt Kase Inc!`);
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // =========================================================================
  // 7. FAQ Accordion Interaction
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-button');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach((other) => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-button');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================================
  // 8. Smooth Anchor Scroll Links
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
