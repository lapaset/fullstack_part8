import React from 'react'
import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'
import Book from './Book'

const Recommend = ({ show }) => {
  const me = useQuery(ME)

  const favorite = me.data.me ? me.data.me.favoriteGenre : null

  const favoriteBooks = useQuery(
    ALL_BOOKS,
    {
      variables: { genre: favorite }
    }
  )

  if (favoriteBooks.loading) {
    return <div>loading...</div>
  }

  if (!favoriteBooks.data) {
    return <div>cannot connect to the database</div>
  }

  return show
    ? <div>
        <h2>recommendations</h2>
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
            {favoriteBooks.data.allBooks
              .map(b => <Book key={b.title} b={b} /> )}
          </tbody>
        </table>
      </div>
    : null
}

export default Recommend