const productList = document.getElementById("product-list");
const loadMoreBtn = document.getElementById("load-more");
const form = document.getElementById("main-form");
const message = document.getElementById("form-message");

let nextPage = "https://desafio-api.bold.workers.dev/products?page=1";

// ---------- VALIDAÇÕES ----------

// Validação de CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ""); // remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Máscara de CPF
document.getElementById("cpf").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

// Submissão do formulário principal
form.addEventListener("submit", (e) => {
  e.preventDefault();
  message.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();

  if (!name || !email || !cpf) {
    message.textContent = "Todos os campos são obrigatórios!";
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    message.textContent = "Digite um e-mail válido!";
    return;
  }

  if (!validarCPF(cpf)) {
    message.textContent = "Digite um CPF válido!";
    return;
  }

  message.style.color = "green";
  message.textContent = "Formulário enviado com sucesso!";
  form.reset();
});

// ---------- PRODUTOS ----------
function renderProducts(products) {
  products.forEach((product) => {
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

loadMoreBtn.addEventListener("click", fetchProducts);
fetchProducts();
