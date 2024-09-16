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

//Contenedores
let gridBike = document.querySelector('.grid.bike')
let gridMotorbike = document.querySelector('.grid.motorbike')
let cart_items = document.querySelector('.cart_items')

//LocalStorage Key
let LSkey= 'items';

/* ----- General Functions ----- */
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
  //let cart_items = document.querySelector('.cart_items')
  let items = cart_items.querySelectorAll('.cart_item');
  let total = 0;
  for (let i = 0; i < items.length; i++) {
      let elementPrice = parseFloat(items[i].querySelector('.cart_item_price').innerText.replace('$',''));

      let elementQuantity = items[i].querySelector('.quantity').value;

      total = total + (elementPrice * elementQuantity)
  }
  total = total.toFixed(2)
  document.querySelector('.total_amount').innerHTML = `$${total}`
}

function deleteItem() {
  let parent = this.parentNode; // <div class="cart_item">
  parent.remove()
  updateTotal();

  // Para local storage
  const id = parent.getAttribute('data-id');
  //removeFromLS(id)
  editLS(id, 'removeItem')
}
function addOne(father) {
  let currVal = +father.querySelector('.quantity').value;
  father.querySelector('.quantity').value = currVal + 1;
  updateTotal() 
  
  // Para local storage
  const id = father.getAttribute('data-id');
  editLS(id, father.querySelector('.quantity').value)
}
function substractOne(father) {
    let currVal = +father.querySelector('.quantity').value;
    if(currVal <= 1) father.querySelector('.quantity').value = 1;
    else{
        father.querySelector('.quantity').value = currVal - 1;
        updateTotal()
    }
    // Para local storage
    const id = father.getAttribute('data-id');
    editLS(id, father.querySelector('.quantity').value)
}
/* ----- End of Functions ----- */

function addItemToCart(name,price,imgSrc){
  //id para el localStorage
  let id = new Date().getTime().toString();
  displayItemsToCart(id,name,price,imgSrc)
  /* let cart_item = document.createElement('div');
  cart_item.classList.add('cart_item')
  cart_item.setAttribute('data-id', id);

  let content = `
  <div class="cart_item_img_container">
      <img src="${imgSrc}" alt="${name}" class="cart_item_img">
  </div>
  <h3 class="cart_item_name">${name}</h3>
  <div class="cart_item_actions">
        <i class='bx bx-minus-circle bx-sm'></i>
        <input type="text" class="quantity" value="1" disabled>
        <i class='bx bx-plus-circle bx-sm'></i>
  </div>
  <h3 class="cart_item_price">${price}</h3>
  <button class="btn btn-delete"><i class='bx bxs-cart bx-sm'></i></button>`;
  cart_item.innerHTML = content;
  cart_items.append(cart_item);

  cart_item.querySelector('.btn.btn-delete').addEventListener('click', deleteItem)
  cart_item.querySelector('.bx-plus-circle').addEventListener('click', ()=> addOne(cart_item))
  cart_item.querySelector('.bx-minus-circle').addEventListener('click', ()=> substractOne(cart_item))  */
  addToLS(id,name,price,imgSrc)
  displayAlert("Added item to the cart :D",'green')
}

//3ro get the info of the card
function getItemInfo() {
  let parent = this.parentNode.parentNode.parentNode; // <div class="card">
  let imgSrc = parent.querySelector('.card_img').src;
  let name = parent.querySelector('.card_body_title').innerText;
  let price = parent.querySelector('.card_price').innerText;
  /* console.log(imgSrc)
  console.log(name)
  console.log(price) */

  //pero si ese item ya existe no hay que agregarlo de nuevo
  let cart_item_names = cart_items.querySelectorAll('.cart_item_name');
  for (let i = 0; i < cart_item_names.length; i++) {
      if(cart_item_names[i].innerText === name){
        //console.log('dentro del IF')
         displayAlert("It's already in the cart this item",'yellow')
         return //because no longer we want to return the code below
      }
  }

  addItemToCart(name,price,imgSrc)
  updateTotal()
}

// 2do paso - darle onClick a los botones
function addOnClick() {
  let addBtns = document.querySelectorAll('.btn.add_to_cart')
  addBtns.forEach(addBtn => {
      addBtn.addEventListener('click', getItemInfo)
  })
}

/* 1er paso -- Display Data*/
window.addEventListener('DOMContentLoaded', ()=>{
  gridBike.innerHTML = displayCards(bikes);
  gridMotorbike.innerHTML = displayCards(motorbikes); 

  // 2do paso - darle onClick a los botones
  addOnClick()
  //Local Storage data - load
  setupCartItems()
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
function displayItemsToCart(id,name,price,imgSrc, quantity = 1){
    let cart_item = document.createElement('div');
    cart_item.classList.add('cart_item')
    cart_item.setAttribute('data-id', id);

    let content = `
    <div class="cart_item_img_container">
        <img src="${imgSrc}" alt="${name}" class="cart_item_img">
    </div>
    <h3 class="cart_item_name">${name}</h3>
    <div class="cart_item_actions">
            <i class='bx bx-minus-circle bx-sm'></i>
            <input type="text" class="quantity" value="${quantity}" disabled>
            <i class='bx bx-plus-circle bx-sm'></i>
    </div>
    <h3 class="cart_item_price">${price}</h3>
    <button class="btn btn-delete"><i class='bx bxs-cart bx-sm'></i></button>`;
    cart_item.innerHTML = content;
    cart_items.append(cart_item);

    /* attach listeners to the new buttons */
    cart_item.querySelector('.btn.btn-delete').addEventListener('click', deleteItem)
    cart_item.querySelector('.bx-plus-circle').addEventListener('click', ()=> addOne(cart_item))
    cart_item.querySelector('.bx-minus-circle').addEventListener('click', ()=> substractOne(cart_item)) 
}

//LocalStorage Functions
function addToLS(id,name,price,imgSrc){
    let obj = {id,name,price,imgSrc, quantity: 1}
    let items = getLS()
    items.push(obj)
    localStorage.setItem(LSkey, JSON.stringify(items))
  }
function getLS() {
    return localStorage.getItem(LSkey) ?
        JSON.parse(localStorage.getItem(LSkey)) :
        []
}
function setupCartItems() {
    // console.log(localStorage.getItem(LSkey))
    let items = getLS()
    if(items.length > 0){
      items.forEach(item => {
        const {id,name,price,imgSrc, quantity} = item;
        displayItemsToCart(id,name,price,imgSrc, quantity)
      })
    }
}
function editLS(id, typeOrQuantity) {
    let items = getLS();
    if(typeOrQuantity === 'removeItem'){
        items = items.filter(item => item.id !== id)
    }
    else{
        items = items.map(item => {
            if(item.id === id) {
                return {
                    ...item,
                    quantity: typeOrQuantity
                }
            }
            return item
        })
    }
    //Update now the LS
    localStorage.setItem(LSkey, JSON.stringify(items))
    //if there is no items remove LS
    if(items.length === 0){
      localStorage.removeItem(LSkey)
    }
}
