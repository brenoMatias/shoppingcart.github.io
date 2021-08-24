const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q='; // define o url como const 
const items = document.querySelector('.items'); // seleciona onde os produtos da API vao
const cartItems = document.querySelector('.cart__items'); // seleciona elementos que estão dentro do carrinho
const cart = document.querySelector('.cart');
let valueSum = 0; // const para início do requisito 5
const totalPrice = document.querySelector('.total-price'); // req 5 // seleciona a posição do preço total

const saveOnLocalStorage = () => { // req 4 // função de salvar no local storage
  const savedItems = cartItems.innerHTML; // innerHtml dos item dos carros serão com base no json
  localStorage.setItem('savedItems', savedItems); // storage.setItem(keyName, keyValue);
  const totalPriceItens = totalPrice.innerHTML;
  localStorage.setItem('totalPrice', totalPriceItens);
};

const loadLocalStorage = () => { // req 4 // função para retornar na tela os valores salvos
  const savedItems = localStorage.getItem('savedItems');
  cartItems.innerHTML = savedItems;
  const totalPriceItens = localStorage.getItem('totalPrice');
  totalPrice.innerText = totalPriceItens;
};

function createProductImageElement(imageSource) { // func base (original do exercicio)
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // func base
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function sumTotalValue(prices) { // req 5
    valueSum += prices; // a função em createElement irá passar o valor da key salePrice para a soma
    const floatedValue = await parseFloat(valueSum);
    totalPrice.innerHTML = floatedValue; // mudar o innerHTMl 
  }

function cartItemClickListener(event) { // func base req 3
  event.target.remove(); // req 3
  saveOnLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) { // func base req 2
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // criação dos elementos do carrinho
  li.addEventListener('click', cartItemClickListener); // evento de click de remoção
  cart.appendChild(cartItems); // req 2
  cartItems.appendChild(li); // req 2
  saveOnLocalStorage(); // req 4
  sumTotalValue(salePrice); // req 5
  return li;
}

function getSkuFromProductItem(item) { // func base req 2
  return item.querySelector('span.item__sku').innerText;
}

const addProductToCart = (event) => { // req 2
  const idItem = getSkuFromProductItem(event.target.parentNode); // returns the parent of the specified node in the DOM tree.
// o parent node neste caso será a lista dos produtos da section criada em createItemProductElement
    fetch(`https://api.mercadolibre.com/items/${idItem}`) // acessa as infos dentro das propiedades do objto
    .then((response) => {
        response.json()
          .then(({ id: sku, title: name, price: salePrice }) => { // mira os dados dentro da propriedade selecionada do objeto
              createCartItemElement({ sku, name, salePrice });
            });
      });   
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // definição das entradas com bases nos dados
// recebidos // func base req 1
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addProductToCart);
  return section;
}

const addLoadingText = () => { // req 7
  const loadingText = document.createElement('p');
  loadingText.className = 'loading';
  loadingText.innerHTML = 'loading...';
  return loadingText;
};

const fetchProduct = () => { // req 1 func auxliar (função principal para acessar a API)
  const loadingText = addLoadingText(); // req 7
  items.appendChild(loadingText); // req 7

  fetch(`${apiUrl}computador`) // accessing and manipulating parts of the HTTP pipeline,
    .then((response) => response.json()) // then() method returns a Promise // transformação dos dados no formato json
      .then((responseJson) => { // aqui o dado em json será usado como parametro para a nova função
        responseJson.results.forEach(({ id: sku, title: name, thumbnail: image }) => { // os dados que queremos (id,title, thumbnai) 
// estão na prop "results" da array json
          const product = createProductItemElement({ id: sku, title: name, thumbnail: image }); // o forEach irá atuar 
// em todos os objetos da categoria selecionada(computador) -> levando em consideração a prop results
          items.appendChild(product);
        });
        loadingText.remove(); // vai remover o texto somente quando a api tiver sido carregada (quando a promisse se cumprir)
      });
};

const clearCart = () => { // req 6
  cartItems.innerHTML = ''; // apenas mudar a base dos dados o programa retorna null
  totalPrice.innerHTML = ''; // por nao ter acesso as propriedades certas retorna null
  valueSum = 0;
  saveOnLocalStorage();
};

const emptyCartButton = document.querySelector('.empty-cart'); // req 6
emptyCartButton.addEventListener('click', clearCart);

window.onload = () => {
  fetchProduct();
  loadLocalStorage();
};