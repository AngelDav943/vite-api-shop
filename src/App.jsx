import { useEffect, useState } from 'react'
import useFetch from 'react-fetch-hook'

import Card from './components/card';
import Item from './components/item';

import './styles/app.css'
import './styles/item.css'
import './styles/cards.css'

export default function() {
  const { data: catalog } = useFetch(
    'https://fakestoreapi.com/products'
  );

  const { data: categories } = useFetch(
    'https://fakestoreapi.com/products/categories'
  );

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

  function displaySearch(search)
  {
    var items = document.querySelectorAll(".card")

    items.forEach(item => {
      
    })
  }

  return (
    <>
      <header>
        {(
          categories && categories.map((category) => {
            return <button key={category} onClick={() => {displayCategory(category)}} >{category}</button>
          }
        )) || (
          <button disabled>Loading..</button>
        )
        }
      </header>

      <main>
        { catalog && catalog.map(({id, image, title, category, description, rating, price}) => (
          <Card key={id} src={image} name={title} price={price} category={category} rating={rating} description={description}/>
          /*<Item key={id} title={title} description={description} price={price} category={category} image={image} rating={rating}>
          </Item>*/
        ))}
      </main>



    </>
  )
}