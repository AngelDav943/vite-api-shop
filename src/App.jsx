import { useEffect, useState } from 'react'
import useFetch from 'react-fetch-hook'
import './styles/app.css'

function App() {
  const { isLoading, data, error } = useFetch(
    'https://fakestoreapi.com/products'
  );

  console.log(data)

  return (
    <>
      {data && data.map(({id, image, title, category, description, rating, price}) => (
        <div key={id}>
          <h1>{title}</h1>
          <span>{category}</span>
          <p>{description}</p>
        </div>
      ))}
    </>
  )
}

export default App
