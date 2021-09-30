import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
// import Users from './components/Users';
import Notes from './components/Notes';
import SendMessage from './components/SendMessage';

export interface UserData {
  id: number
  message: string
}

function App() {
  
  const client = new ApolloClient( {
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
    headers: {
      //Authorization
  }
  })

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
