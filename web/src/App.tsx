import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import Notes from './components/Notes';
import SendMessage from './components/SendMessage';
import { setContext } from 'apollo-link-context';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Users from './components/Users';
import Login from './components/Login';

export interface UserData {
  id: number
  message: string
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


function App() {

  const [userData, setUserData] = useState<UserData[]>([{
    id: 1,
    message: "Sometimes waking up is enough <3"
  }])
  
  const saveMessage = (msg: string): void => {
    setUserData([...userData,  { id: 1, message: msg }])
  }

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
