import { useEffect, useState } from 'react'
import useFetch from 'react-fetch-hook'

import Item from './components/item';

import './styles/app.css'
import './styles/item.css'

export default function() {
  const { data: catalog } = useFetch(
    'https://fakestoreapi.com/products'
  );

  const { data: categories } = useFetch(
    'https://fakestoreapi.com/products/categories'
  );

  function displayCategory(category) {
    var items = document.querySelectorAll(`.item`)

    items.forEach(item => {
      if (item.getAttribute("category") == category) {
        item.classList.add("show")
      } else {
        item.classList.remove("show")
      }
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
          <Item key={id} title={title} description={description} price={price} category={category} image={image} rating={rating}>
          </Item>
        ))}
      </main>

    </>
  )
}