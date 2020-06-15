const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()
mongoose.set('useFindAndModify', false)
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(e => {
    console.log('Error connecting to MongoDB', e)
  })

const typeDefs = gql`

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      return Book.find({}).populate('author')

      /*return !args.author
        ? !args.genre
          ? books
          : books.filter(b => b.genres.includes(args.genre))
        : !args.genre
          ? books.filter(b => b.author === args.author)
          : books.filter(b => b.author === args.author &&
                              b.genres.includes(args.genre))*/
    },
    allAuthors: () => Author.find({})
  },
  
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: { $in: root } })
      return books.length

      /*const reducer = (sum, b) => b.author === root.name
        ? sum + 1
        : sum

      const count = books.reduce(reducer, 0)
      return count*/
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
    
      if (!author) {
        console.log('here')
        authorObject = new Author({ name: args.author })
        author = await authorObject.save()
        console.log('author', author)
      }
      
      const book = new Book({ ...args, author: author })
      
      return book.save()
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author)
        return null

      author.born = Number(args.setBornTo)
      try {
        await author.save()
      } catch (e) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})