import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context'
import Notes from './pages/Notes'

function App() {

  const httpLink = new HttpLink({ uri: "http://localhost:4000" })
  const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem("token")

    return {
      ...headers,
      headers: {
        Authorization: token ? `Bearer ${token}` : null
      }
    }
  })

  const link = authLink.concat(httpLink as any)
  const client = new ApolloClient({
    link: link as any,
    cache: new InMemoryCache()
  })


  return (
    <ApolloProvider client={client}>
      <Notes />
    </ApolloProvider>
  )
}

export default App;
