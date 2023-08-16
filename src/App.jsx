import { useEffect, useState } from 'react'
import useFetch from 'react-fetch-hook'

import Card from './components/card';
import Item from './components/item';

import './styles/app.css'
import './styles/item.css'
import './styles/cards.css'

function searchMatches(string, target) {
  let result = 0
  let stringSplit = string.split(" ")
  for (let index = 0; index < stringSplit.length; index++) {
    let found = target.toLowerCase().match(stringSplit[index].toLowerCase()) != null;
    if (found && stringSplit[index].replaceAll(" ", "") != "") result += 1
  }
  return result
}

export default function() {
  var [searching, setSearching] = useState(false);

  var [ascending, setAscending] = useState(true);
  var [sorting, setSorting] = useState("price");

  const { data: catalog } = useFetch(
    'https://fakestoreapi.com/products'
  );

  const { data: categories } = useFetch(
    'https://fakestoreapi.com/products/categories'
  );

  function sort(attribute, isAscending) {

    if (attribute != undefined) setSorting(attribute)
    if (isAscending != undefined) setAscending(isAscending)

    console.log(sorting, ascending)

    var index = 0
    var shouldSwitch;
    var list = document.getElementById("catalog");
    var switching = true;

    while (switching) {
      switching = false;
      let cards = list.querySelectorAll(".card");
      for (index = 0; index < (cards.length - 1); index++) {
        shouldSwitch = false;
        let card = cards[index];
        let nextCard = cards[index + 1]

        let cardSort = Number(card.getAttribute("sort"))
        let nextCardSort = Number(card.getAttribute("sort"))

        let canSwitch = Number(card.getAttribute(sorting)) + cardSort > Number(nextCard.getAttribute(sorting)) + nextCardSort // ascending

        if (ascending == false) canSwitch = Number(card.getAttribute(sorting)) - cardSort < Number(nextCard.getAttribute(sorting)) - nextCardSort // descending

        if (canSwitch) {
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

  function displayCategory(category) {
    var items = document.querySelectorAll(`.card`)

    items.forEach(item => {
      if (item.getAttribute("category") == category) {
        item.classList.add("show")
      } else {
        item.classList.remove("show")
      }
    })
  }

  function toggleSearch(override)
  {
    setSearching(!searching)
    if (override != null) setSearching(override)
    displaySearch()
  }

  function toggleFilter()
  {
    let filterdiv = document.getElementById("search-filter")
    if (filterdiv) filterdiv.classList.toggle("hidden")
  }

  function displaySearch()
  {
    var input = document.getElementById("search_input")
    if (!input) return;

    var toSearch = input.value
    var items = document.querySelectorAll(".card")

    let biggest = 0

    items.forEach(item => {
      var found = searchMatches(toSearch,item.getAttribute("name")) || (toSearch.replaceAll(" ","") == "") ? 1 : undefined
      item.setAttribute("sort", found)
      if (found > biggest) biggest = found
      if (found) {
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

    //sort("sort");
  }

  return (
    <>
      <header>
        <button className='image' onClick={() => {toggleFilter()}}>
          <img src='src/assets/images/search.png'></img>
        </button>

        <button className='image'>
          <img src='src/assets/images/cart.png'></img>
        </button>
      </header>

      <div id='search-filter' className='hidden'>
        <input type="text" className='expanded' id="search_input" onChange={() => {displaySearch()}} placeholder='Search'/>
        <div className='row'>
          <div className='column'>
            <label>
              <span>Category:</span>
              <select name="selection" onChange={(e) => {displayCategory(e.target.value)}}>
                {(
                  categories && categories.map((category) => {
                    return <option key={category} value={category} >{category}</option>
                  })
                )}
              </select>
            </label>
            <label>
              <span>Sort by</span>
              <select name="selection" onChange={(e) => {sort(e.target.value, undefined)}}>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
              </select>
            </label>
          </div>

          <div className='column right' onChange={(e) => {sort(undefined, (String(e.target.value) == "true"))}}>
            <label>Ascending<input type="radio" name="ascending" value={true}/></label>
            <label>Descending<input type="radio" name="ascending" value={false}/></label>
          </div>
        </div>
      </div>

      <main id='catalog'>
        { catalog && catalog.map(({id, image, title, category, description, rating, price}) => (
          <Card key={id} src={image} name={title} price={price} category={category} rating={rating} description={description}/>
        ))}
      </main>

    </>
  )
}