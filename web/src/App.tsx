import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, gql, useQuery } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import Notes from './components/Notes';
import SendMessage from './components/SendMessage';
import { setContext } from 'apollo-link-context';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Users from './components/Users';
import Login from './components/Login';

export interface UserData {
  id: number
  note: string
}

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

const NOTES_QUERY = gql`
  query NOTES_QUERY {
    userNotes {
      notes {
        note
        id
      }
    }
  }
`

function App() {
  const [userData, setUserData] = useState<UserData[]>([{
    id: 1,
    note: "Sometimes waking up is enough <3"
  }])

  const GetMessages = useCallback(() => {
    const { loading, error, data } = useQuery(NOTES_QUERY)


    data.userNotes[0].notes.map((d: UserData) => {
      setUserData([...userData, {
        id: d.id,
        note: d.note
      }])
    })
  }, [])

  const saveMessage = (msg: string): void => {
    setUserData([...userData, { id: 1, note: msg }])
  }

  useEffect(() => {
    GetMessages()
  }, [])

  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/notes">
            <Notes />
            <SendMessage saveMessage={saveMessage} />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>

  );
}

export default App;
