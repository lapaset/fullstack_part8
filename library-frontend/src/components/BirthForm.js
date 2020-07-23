import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { EDIT_AUTHOR } from '../queries'

const BirthForm = ({ authors, notify, token }) => {
  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    onError: error => {
      if (error.graphGLErrors)
        notify(error.graphQLErrors[0].message)      
      if (error.networkError)
        console.log(`Network error: `, error.networkError.message)
    }
  })

  const submit = async event => {
    event.preventDefault()
    
    if (name.length > 0 && born.length > 0)
      editAuthor({ variables: { name, setBornTo: parseInt(born) } })
    else
      notify('Value missing')
    setName('')
    setBorn('')
  }

  if (!token)
    return null

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