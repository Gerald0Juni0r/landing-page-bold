(function () {
  'use strict';

  const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  let nextPage = 'https://desafio-api.bold.workers.dev/products?page=1';
  let loading = false;

  const listEl = $('#product-list');
  const loadMoreBtn = $('#load-more');
  const cardTpl = $('#product-card-template');

  async function loadProducts() {
    if (loading || !nextPage) return;
    loading = true;
    listEl.setAttribute('aria-busy', 'true');

    try {
      const res = await fetch(nextPage);
      const data = await res.json();

      renderProducts(data.products);

      nextPage = data.nextPage || '';
      if (!nextPage) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Todos os produtos carregados';
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      loading = false;
      listEl.removeAttribute('aria-busy');
    }
  }

  function renderProducts(items) {
    const frag = document.createDocumentFragment();

    items.forEach((p) => {
      const node = cardTpl.content.cloneNode(true);
      node.querySelector('img').src = p.image;
      node.querySelector('img').alt = p.name;
      node.querySelector('.card__title').textContent = p.name;
      node.querySelector('.card__desc').textContent = p.description;
      node.querySelector('.old').textContent = `De: ${fmtBRL.format(p.oldPrice)}`;
      node.querySelector('.now').textContent = `Por: ${fmtBRL.format(p.price)}`;
      node.querySelector('.installments').textContent = `ou ${p.installments.count}x de ${fmtBRL.format(p.installments.value)}`;

      frag.appendChild(node);
    });

    listEl.appendChild(frag);
  }

  loadMoreBtn.addEventListener('click', loadProducts);
  loadProducts();
})();

