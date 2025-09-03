const productList = document.getElementById("product-list");
const loadMoreBtn = document.getElementById("load-more");

let nextPage = "https://desafio-api.bold.workers.dev/products?page=1";

// Função para criar os cards de produtos
function renderProducts(products) {
  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="https:${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <p class="price">De: R$${product.oldPrice} <br> Por: R$${product.price}</p>
      <p>ou ${product.installments.count}x de R$${product.installments.value}</p>
      <button>Comprar</button>
    `;

    productList.appendChild(card);
  });
}

// Função para buscar os produtos
async function fetchProducts() {
  if (!nextPage) {
    loadMoreBtn.style.display = "none";
    return;
  }

  try {
    const res = await fetch(nextPage);
    const data = await res.json();

    renderProducts(data.products);
    nextPage = data.nextPage ? `https://${data.nextPage}` : null;
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

// Evento do botão "Carregar mais"
loadMoreBtn.addEventListener("click", fetchProducts);

// Carregar a primeira página ao iniciar
fetchProducts();
