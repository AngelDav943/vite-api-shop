import { useEffect, useState } from 'react'
import useFetch from 'react-fetch-hook'

import Card from './components/card';
import Item from './components/item';

import './styles/app.css'
import './styles/item.css'
import './styles/cards.css'
import './styles/cart.css'
import Cart from './components/cart';

function searchMatches(string, target) {
  let result = 0
  let stringSplit = string.split(" ")
  for (let index = 0; index < stringSplit.length; index++) {
    let found = target.toLowerCase().match(stringSplit[index].toLowerCase()) != null;
    if (found && stringSplit[index].replaceAll(" ", "") != "") result += 1
  }
  return result
}

export default function () {
  var [currentCategory, setCategory] = useState("all")
  var [ascending, setAscending] = useState(true);
  var [total, setTotal] = useState(0);

  const { data: catalog } = useFetch(
    'https://fakestoreapi.com/products'
  );

  const { data: categories } = useFetch(
    'https://fakestoreapi.com/products/categories'
  );

  function sort() {
    var sorting = document.getElementById("sortType").value;
    var isAscending = ascending

    var index, cards, shouldSwitch;
    var list = document.getElementById("catalog");
    var switching = true;

    while (switching) {
      switching = false;
      cards = list.querySelectorAll(".card");
      for (index = 0; index < (cards.length - 1); index++) {
        shouldSwitch = false;
        let card = cards[index];
        let nextCard = cards[index + 1]

        let cardSort = Number(card.getAttribute(sorting))// + Number(card.getAttribute("sort"))
        let nextCardSort = Number(nextCard.getAttribute(sorting))// + Number(card.getAttribute("sort"))

        if ((!isAscending && cardSort > nextCardSort) || (isAscending && nextCardSort > cardSort)) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        cards[index].parentNode.insertBefore(cards[index + 1], cards[index]);
        switching = true;
      }
    }
  }

  function displaySearch(category) {
    category = category || currentCategory
    var input = document.getElementById("search_input")
    if (!input) return;

    var toSearch = input.value
    var items = document.querySelectorAll(".card")

    let biggest = 0

    items.forEach(item => {
      var found = searchMatches(toSearch, item.getAttribute("name")) || (toSearch.replaceAll(" ", "") == "") ? 1 : undefined
      item.setAttribute("sort", found)
      if (found > biggest) biggest = found
      if (found && (item.getAttribute("category") == category || category == "all")) {
        item.classList.add("show")
      } else {
        item.classList.remove("show")
      }
    })

    if (biggest > 2 && biggest == toSearch.split(" ").length) {
      items.forEach(item => {
        if (item.getAttribute("sort") <= 1) {
          item.classList.remove("show")
        }
      })
    }
    sort();
  }

  function displayCategory(category) {
    var items = document.querySelectorAll(`.card`)

    setCategory(category)

    items.forEach(item => {
      if (item.getAttribute("category") == category || category == "all") {
        item.classList.add("show")
      } else {
        item.classList.remove("show")
      }
    })

    displaySearch(category)
  }

  function toggleFilter() {
    let filterdiv = document.getElementById("filter")
    let cartdiv = document.getElementById("cart")
    if (!filterdiv || !cartdiv) return

    let status = filterdiv.classList.contains("hidden")
    if (status) {
      filterdiv.classList.remove("hidden")
      cartdiv.classList.add("hidden")
    } else {
      filterdiv.classList.add("hidden")
      cartdiv.classList.add("hidden")
    }
  }

  function toggleCart() {
    let filterdiv = document.getElementById("filter")
    let cartdiv = document.getElementById("cart")
    if (!filterdiv || !cartdiv) return

    let status = cartdiv.classList.contains("hidden")
    if (status) {
      filterdiv.classList.add("hidden")
      cartdiv.classList.remove("hidden")
    } else {
      filterdiv.classList.add("hidden")
      cartdiv.classList.add("hidden")
    }
  }

  function newTotal(newCart) {
    let total = 0
    for (let i = 0; i < newCart.length; i++) {
      total = total + (newCart[i].price * newCart[i].amount)
    }

    setTotal(total)
  }

  var [cart, setCart] = useState([]);
  function addItem(item, newkey) {
    let duplicate = cart.find(target => target.id == item.id)

    let amount = item.amount || 1
    var newitem = { ...item, key: newkey, amount: duplicate == undefined ? amount : (duplicate.amount + (amount)) }
    var newCart = [...cart, newitem]

    if (duplicate != undefined) {
      newCart = cart
      newCart[cart.indexOf(duplicate)] = newitem
    }

    setCart(newCart)
    newTotal(newCart)
  }

  function removeItem(index, all) {
    var newCart = [...cart]

    if (all == true || (all == false && newCart[index].amount <= 1)) {
      newCart.splice(index, 1)
    }

    if (all == false && newCart[index]) {
      newCart[index].amount -= 1
    }

    setCart(newCart)
    newTotal(newCart)
  }

  return (
    <>
      <header>
        <button className='image' onClick={toggleFilter}>
          <img src='src/assets/images/search.png'></img>
        </button>

        <button className='image' onClick={toggleCart}>
          <img src='src/assets/images/cart.png'></img>
          {(
            cart.length > 0 && (<span>{cart.length}</span>)
          )}
        </button>
      </header>

      <div id='filter' className='tab hidden'>
        <input type="text" className='expanded' id="search_input" onChange={() => { displaySearch() }} placeholder='Search' />
        <div className='row'>
          <div className='column'>
            <label>
              <span>Category:</span>
              <select name="selection" onChange={(e) => { displayCategory(e.target.value) }}>
                <option value="all">All</option>
                {(
                  categories && categories.map((category) => {
                    return <option key={category} value={category} >{category}</option>
                  })
                )}
              </select>
            </label>
          </div>

          <div className='column right' id='isAscending' onChange={(e) => { }}>
            <label>
              <span>Sort by</span>
              <select name="selection" id='sortType' onChange={(e) => { }}>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </label>
            <label>Ascending<input type="radio" name="ascending" onClick={(e) => { setAscending(true) }} defaultChecked /></label>
            <label>Descending<input type="radio" name="ascending" onClick={(e) => { setAscending(false) }} /></label>
            <button onClick={(e) => { sort() }}>Apply filter</button>
          </div>
        </div>

      </div>

      <main id="cart" className="tab hidden">
        <p>Total: {Math.floor((total * 100)) / 100}$</p>
        {cart && cart.map((data, index) => (
          <Cart
            key={String(index) + String(data.key)}
            src={data.src}
            name={data.name}
            price={data.price}
            category={data.category}
            rating={data.rating}
            description={data.description}
            amount={data.amount}
            onClick={(all) => { removeItem(index, all) }} />
        ))}
      </main>

      <main id='catalog'>
        {catalog && catalog.map(({ id, image, title, category, description, rating, price }) => (
          <Card key={id} id={id} src={image} name={title} price={price} category={category} rating={rating} description={description} onClick={addItem} />
        ))}
      </main>

    </>
  )
}