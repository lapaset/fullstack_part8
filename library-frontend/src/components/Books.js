import React, { useState } from 'react'
import Book from './Book'

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState(null)

  const genres = () => {
    const genres = []
    books.forEach(b => {
      b.genres.forEach(g => {
        if (!genres.includes(g))
          genres.push(g)
        })
        return null
    })
    return genres
  }

  return show
  ? <div>
        <h2>books</h2>

        {genre
          ? <h3>Books in {genre}</h3>
          : null
        }
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {genre
              ? books.map(b => b.genres.includes(genre)
                ? <Book key={b.title} b={b} />
                : null
                )
                
              : books.map(b =>
                <Book key={b.title} b={b} />
            )}
          </tbody>
        </table>
        <button key='all' name='all' onClick={() => setGenre(null)}>all</button>
        {genres().map(g => <button key={g} name={g} onClick={() => setGenre(g)}>{g}</button>)}
      </div>
  : null
}

export default Books