import React from 'react'

const Book = ({b}) => (
  <tr>
    <td>{b.title}</td>
    <td>{b.author.name}</td>
    <td>{b.published}</td>
  </tr>
)

export default Book