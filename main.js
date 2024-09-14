const data = {
  bikes: [
      {
          id:1,
          name: 'Bike 1',
          src: './img/bike1.png',
          price: 328.92
      },
      {
          id:2,
          name: 'Bike 2',
          src: './img/bike2.png',
          price: 482.63
      },
      {
          id:3,
          name: 'Bike 3',
          src: './img/bike3.png',
          price: 572.83
      },
      {
          id:4,
          name: 'Bike 4',
          src: './img/bike4.png',
          price: 409.38
      },
      {
          id:5,
          name: 'Bike 5',
          src: './img/bike5.png',
          price: 394.32
      },
      {
          id:6,
          name: 'Bike 6',
          src: './img/bike6.png',
          price: 364.74
      }
  ],
  motorbikes: [
      {
          id:1,
          name: 'Motorbike 1',
          src: './img/motorbike1.png',
          price: 1023.33
      },
      {
          id:2,
          name: 'Motorbike 2',
          src: './img/motorbike2.png',
          price: 943.54
      },
      {
          id:3,
          name: 'Motorbike 3',
          src: './img/motorbike3.png',
          price: 524.63
      },
      {
          id:4,
          name: 'Motorbike 4',
          src: './img/motorbike4.png',
          price: 823.42
      }
  ]
}
//destructuring
const {bikes,motorbikes} = data;

let gridBike = document.querySelector('.grid.bike')
let gridMotorbike = document.querySelector('.grid.motorbike')
let cart_items = document.querySelector('.cart_items')

//LocalStorage Key
let LSkey= 'items';

/* ---- general functions ---- */
function displayAlert(msm,color) {
  let alert = document.querySelector('.alert');
  alert.innerHTML = `
      <div class="content">
          <div class="box-message ${color}">
              <p>${msm}</p> <i class='bx bx-x-circle bx-sm'></i>
          </div>
      </div>`;
  const closeBtn = alert.querySelector('.bx.bx-x-circle');
  closeBtn.addEventListener('click',() => alert.innerHTML = '')
}
function updateTotal() {
  let cart_items = document.querySelector('.cart_items');
  let cart_item = cart_items.querySelectorAll('.cart_item');
  let total = 0;
  for (let i = 0; i < cart_item.length; i++) {
      let elementPrice = parseFloat(cart_item[i].querySelector('.cart_item_price').innerText.replace('$',''));

      total = total + elementPrice 
  }
  total = total.toFixed(2)
  document.querySelector('.total_amount').innerHTML = `$${total}`
}

function deleteItem() {
  let parent = this.parentNode;
  parent.remove()
  updateTotal();

  const id = parent.getAttribute('data-id');
  removeFromLS(id)
}

/* ---- END of general functions ----*/

function addItemToCart(name,price,imgSrc){
  //id para el localStorage
  let id = new Date().getTime().toString();
  
   let cart_item = document.createElement('div');
  cart_item.classList.add('cart_item')
  cart_item.setAttribute('data-id', id);

    //pero si ese item ya existe no hay que agregarlo de nuevo
    let cart_item_names = cart_items.querySelectorAll('.cart_item_name');
    for (let i = 0; i < cart_item_names.length; i++) {
        if(cart_item_names[i].innerText === name){
          displayAlert("It's already in the cart this item",'yellow')
          return //because no longer we want to return the code below
        }
    }

  let content = `
  <div class="cart_item_img_container">
      <img src="${imgSrc}" alt="${name}" class="cart_item_img">
  </div>
  <h3 class="cart_item_name">${name}</h3>
  <h3 class="cart_item_price">${price}</h3>
  <button class="btn btn-delete"><i class='bx bxs-cart bx-sm'></i></button>`;
  cart_item.innerHTML = content;
  cart_items.append(cart_item);

  displayAlert("Added item to the cart :D",'green')
  addToLS(id,name,price,imgSrc)

  cart_item.querySelector('.btn.btn-delete').addEventListener('click', deleteItem)
}

//3ro get the info of the card
function getItemInfo() {
  let parent = this.parentNode.parentNode.parentNode;
  let imgSrc = parent.querySelector('.card_img').src;
  let name = parent.querySelector('.card_body_title').innerText;
  let price = parent.querySelector('.card_price').innerText;
  /* console.log(imgSrc)
  console.log(name)
  console.log(price) */
  addItemToCart(name,price,imgSrc)
  updateTotal()
}

//2do get all add to cart buttons
function ready() {
  let addBtns = document.querySelectorAll('.btn.add_to_cart')
  addBtns.forEach(addBtn => {
      addBtn.addEventListener('click', getItemInfo)
  })
}

/* 1er paso */
window.addEventListener('DOMContentLoaded', ()=>{
  gridBike.innerHTML = displayCards(bikes);
  gridMotorbike.innerHTML = displayCards(motorbikes);
  /* 2do Second */
  ready();

  //ultimo LocalStorage ver si existe
  setupItems()
  updateTotal()
})

function displayCards(data){
  let output = ''
  for (let i = 0; i < data.length; i++) {
      output += `
          <div class="card">
              <div class="card_img_container">
                  <img src="${data[i].src}" alt="${data[i].name}" class="card_img">
              </div>
              <div class="card_body">
                  <h4 class="card_body_title">${data[i].name}</h4>
                  <div>
                      <span class="card_price">$${data[i].price}</span>
                      <button class="btn add_to_cart"><i class='bx bxs-cart bx-sm'></i></button>
                  </div>
              </div>
          </div>`
  }
  return output;
}

function displayItemsToCart(id,name,price,imgSrc) {
  let cart_item = document.createElement('div');
  cart_item.classList.add('cart_item')
  cart_item.setAttribute('data-id', id);

  let content = `
  <div class="cart_item_img_container">
      <img src="${imgSrc}" alt="${name}" class="cart_item_img">
  </div>
  <h3 class="cart_item_name">${name}</h3>
  <h3 class="cart_item_price">${price}</h3>
  <button class="btn btn-delete"><i class='bx bxs-cart bx-sm'></i></button>`;
  cart_item.innerHTML = content;
  cart_items.append(cart_item);

  cart_item.querySelector('.btn.btn-delete').addEventListener('click', deleteItem)
}

// LocalStorage Functions
function addToLS(id,name,price,imgSrc){
  let obj = {id,name,price,imgSrc}
  let items = getLS()
  items.push(obj)
  localStorage.setItem(LSkey, JSON.stringify(items))
}
function getLS() {
  return localStorage.getItem(LSkey) ?
          JSON.parse(localStorage.getItem(LSkey)) :
          []
}
function setupItems() {
  // console.log(localStorage.getItem(LSkey))
  let items = getLS()
  if(items.length > 0){
    items.forEach(item => {
      const {id,name,price,imgSrc} = item;
      displayItemsToCart(id,name,price,imgSrc)
    })
  }
}
function removeFromLS(id) {
  let items = getLS();
  items = items.filter(item => item.id !== id)
  //Update now the LS
  localStorage.setItem(LSkey, JSON.stringify(items))
  //if there is no items remove LS
  if(items.length === 0){
    localStorage.removeItem(LSkey)
  }
}
