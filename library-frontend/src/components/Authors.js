import React from 'react'
import BirthForm from './BirthForm'

const Authors = ({ show, authors, notify, token }) => {

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <BirthForm
        authors={authors}
        notify={notify}
        token={token} />
    </div>
  )
}

export default Authors
