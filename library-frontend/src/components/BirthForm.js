import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { EDIT_AUTHOR } from '../queries'

const BirthForm = ({ authors }) => {
  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')
  
  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  const submit = async event => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo: parseInt(born) } })
    setName('')
    setBorn('')
  }

  const options = authors.map(a => { return ({ value: a.name, label: a.name })})

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <Select
            value={{ value: name, label: name }}
            onChange={option => setName(option.value)}
            options={options} />
        </div>
        <div>
          born
          <input value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
  
}

export default BirthForm