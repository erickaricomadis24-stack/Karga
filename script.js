document.addEventListener("DOMContentLoaded", () => {
  /* ====== Carrito ====== */
  const cartButton = document.getElementById('cart-button');
  const cartPopover = document.getElementById('cart-popover');
  const closeBtn = cartPopover ? cartPopover.querySelector('.close-btn') : null;
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  const purchaseOverlay = document.getElementById('purchase-overlay');
  const closePurchaseOverlay = document.getElementById('close-purchase-overlay');
  const finalizarBtn = cartPopover ? cartPopover.querySelector('.btn.btn-dark.w-100') : null;

  let carrito = [];

  if (cartButton && cartPopover) {
    cartButton.addEventListener('click', () => {
      cartPopover.classList.toggle('d-none');
    });
  }
  if (closeBtn && cartPopover) {
    closeBtn.addEventListener('click', () => {
      cartPopover.classList.add('d-none');
    });
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;

      const existente = carrito.find(item => item.name === name);
      if (existente) {
        existente.cantidad = (existente.cantidad || 1) + 1;
      } else {
        carrito.push({ name, price, img, cantidad: 1 });
      }
      renderCarrito();
    });
  });

  function renderCarrito() {
    if (!cartItems || !cartTotal) return;
    cartItems.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
      total += item.price * (item.cantidad || 1);
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center justify-content-between';
      li.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${item.img}" alt="${item.name}" 
               style="width:40px;height:40px;object-fit:contain;margin-right:10px;">
          <div>
            <strong>${item.name}</strong><br>
            <span>${item.price} Bs x ${item.cantidad || 1}</span>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}" aria-label="Eliminar ${item.name}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      cartItems.appendChild(li);
    });

    cartTotal.textContent = `Total: ${total} Bs`;

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        carrito.splice(index, 1);
        renderCarrito();
      });
    });
  }

  function mostrarCompraCentrada() {
    if (!purchaseOverlay) return;
    purchaseOverlay.style.display = 'flex';
    purchaseOverlay.setAttribute('aria-hidden', 'false');
  }

  function ocultarCompraCentrada() {
    if (!purchaseOverlay) return;
    purchaseOverlay.style.display = 'none';
    purchaseOverlay.setAttribute('aria-hidden', 'true');
  }

  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', () => {
      mostrarCompraCentrada();
      carrito = [];
      renderCarrito();
      cartPopover.classList.add('d-none');
    });
  }

  if (closePurchaseOverlay) {
    closePurchaseOverlay.addEventListener('click', ocultarCompraCentrada);
  }

  if (purchaseOverlay) {
    purchaseOverlay.addEventListener('click', (e) => {
      if (e.target === purchaseOverlay) ocultarCompraCentrada();
    });
  }

  
  const modeloSelect = document.getElementById("modelo-select");
  const uploadInput = document.getElementById("upload-estampado");
  const scaleRange = document.getElementById("scale-range");
  const opacityRange = document.getElementById("opacity-range");
  const guardarBtn = document.getElementById("guardar-diseno");

  const mochilaImg = document.getElementById("mochila-img");
  const estampadoPersonal = document.querySelector(".estampado-personal");

  if (modeloSelect && mochilaImg && estampadoPersonal) {
    modeloSelect.addEventListener("change", () => {
      const modelo = modeloSelect.value;
      mochilaImg.src = `recursos/${modelo}`;
      estampadoPersonal.style.webkitMaskImage = `url('recursos/${modelo}')`;
      estampadoPersonal.style.maskImage = `url('recursos/${modelo}')`;
    });
  }

  if (uploadInput && estampadoPersonal) {
    uploadInput.addEventListener("change", () => {
      const file = uploadInput.files[0];
      if (!file) return;
      if (file.type !== "image/png") {
        alert("Por favor sube un archivo PNG válido.");
        uploadInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        estampadoPersonal.style.backgroundImage = `url('${e.target.result}')`;
        estampadoPersonal.style.opacity = 1;
        estampadoPersonal.style.backgroundSize = "contain";
        estampadoPersonal.style.backgroundRepeat = "no-repeat";
        estampadoPersonal.style.backgroundPosition = "center";
      };
      reader.readAsDataURL(file);
    });
  }

  function aplicarControles() {
    if (!estampadoPersonal) return;
    const escala = scaleRange ? scaleRange.value : 100;
    const opacidad = opacityRange ? opacityRange.value : 100;
    estampadoPersonal.style.backgroundSize = `${escala}%`;
    estampadoPersonal.style.opacity = opacidad / 100;
  }
  if (scaleRange) scaleRange.addEventListener("input", aplicarControles);
  if (opacityRange) opacityRange.addEventListener("input", aplicarControles);
  aplicarControles();

  if (guardarBtn) {
    guardarBtn.addEventListener("click", () => {
      const diseno = {
        name: "Mochila personalizada",
        price: 300,
        img: mochilaImg ? mochilaImg.src : "",
        modelo: modeloSelect ? modeloSelect.value : null,
        personalizado: uploadInput && uploadInput.files[0] ? uploadInput.files[0].name : null,
        escala: scaleRange ? scaleRange.value : null,
        opacidad: opacityRange ? opacityRange.value : null,
        cantidad: 1
      };
      carrito.push(diseno);
      renderCarrito();
      if (cartPopover && cartPopover.classList.contains('d-none')) {
        cartPopover.classList.remove('d-none');
      }
    });
  }

  
  document.querySelectorAll('.producto-card').forEach(card => {
    const vistas = card.querySelectorAll('.vista');
    let index = 0;
    let interval;

    function mostrarVista(i) {
      vistas.forEach((img, idx) => {
        img.classList.toggle('active', idx === i);
      });
    }

    card.addEventListener('mouseenter', () => {
      index = 0;
      mostrarVista(index);
      interval = setInterval(() => {
        index = (index + 1) % vistas.length;
        mostrarVista(index);
      }, 300);
    });

    card.addEventListener('mouseleave', () => {
      clearInterval(interval);
      mostrarVista(0);
    });

    card.addEventListener('click', () => {
      index = (index + 1) % vistas.length;
      mostrarVista(index);
    });
  });

  
  const pasoTriggers = document.querySelectorAll('[data-paso-trigger]');
  const pasoCards = document.querySelectorAll('[data-paso-card]');
  const pasoTexts = document.querySelectorAll('[data-paso-text]');
  const pasoIndices = document.querySelectorAll('[data-paso-index]');

  function activarPaso(pasoId) {
    pasoTexts.forEach(el => {
      el.hidden = true;
      el.setAttribute('aria-hidden', 'true');
    });
    pasoCards.forEach(card => card.classList.remove('zoomed'));
    pasoTriggers.forEach(btn => btn.classList.remove('active'));
    pasoIndices.forEach(idx => idx.classList.remove('active'));

    const targetText = document.querySelector(`[data-paso-text="${pasoId}"]`);
    if (targetText) {
      targetText.hidden = false;
      targetText.setAttribute('aria-hidden', 'false');
    }
    const targetCard = document.querySelector(`[data-paso-card="${pasoId}"]`);
    if (targetCard) targetCard.classList.add('zoomed');
    const targetTrigger = document.querySelector(`[data-paso-trigger="${pasoId}"]`);
    if (targetTrigger) target

