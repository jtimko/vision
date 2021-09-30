import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { useState } from 'react';
// import Users from './components/Users';
import Notes from './components/Notes';
import SendMessage from './components/SendMessage';
import { setContext } from 'apollo-link-context';

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

  const [data, setData] = useState<UserData[]>([{
    id: 1,
    message: "Sometimes waking up is enough <3"
  }])
  // const [msg, setMsg] = useState("")

  const saveMessage = (msg: string): void => {
    setData([...data,  { id: 1, message: msg }])
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        {/* <Users /> */}
        <Notes data={data} />

        <SendMessage saveMessage={saveMessage} />
      </div>
    </ApolloProvider>
   
  );
}

export default App;
