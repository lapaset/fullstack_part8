import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery, useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import Menu from './components/Menu'
import NotificationField from './components/NotificationField'
import { ALL, ME, BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('books')
  const [notification, setNotification] = useState(null)
  const [me, setMe] = useState({})
  const [getUser, { loading: userLoading, data: userData }] = useLazyQuery(ME)
  const result = useQuery(ALL)
  const client = useApolloClient()

  useEffect(() => {
    const loggedUser = localStorage.getItem('library-user-token')
    if (loggedUser)
      setToken(loggedUser)
  }, [])

  useEffect(() => {
    getUser()
    
    if (!userLoading && userData) {
      setMe(userData.me)
    }

  }, [token, userData, userLoading, getUser, me])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL })

    notify(`New book ${addedBook.title} added`)

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    if (!includedIn(dataInStore.allAuthors, addedBook.author))
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors : dataInStore.allAuthors
          .concat(addedBook.author)}
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  if (result.userLoading) {
    return <div>userLoading...</div>
  }

  if (!result.data) {
    return <div>cannot connect to the database</div>
  }

  const logout = () => {
    if (page === 'add')
      setPage('authors')
    setToken(null)
    setMe(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = message => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <div>

      <Menu
        token={token}
        setPage={setPage}
        logout={logout}
      />

      <NotificationField notification={notification} />

      <Authors
        authors={result.data.allAuthors}
        show={page === 'authors'}
        notify={notify}
        token={token}
      />

      <Books
        books={result.data.allBooks}
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        notify={notify}
        updateCacheWith={updateCacheWith}
      />

      <Recommend
        show={page === 'recommend'}
        books={result.data.allBooks}
        favorite={me ? me.favoriteGenre : null}
      />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
        notify={notify}
      />

    </div>
  )
}

export default App