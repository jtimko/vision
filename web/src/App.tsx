import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
import Users from './components/Users';
import Notes from './components/Notes';

export interface UserData {
  id: number
  message: string
}


function App() {
  
  const client = new ApolloClient( {
    uri: "http://localhost:4000",
    cache: new InMemoryCache()
  })


  const [data, setData] = useState<UserData[]>([{
    id: 1,
    message: "Sometimes waking up is enough <3"
  }])
  const [msg, setMsg] = useState("")

  const saveMessage = (): void => {
    setData([...data,  { id: 1, message: msg }])
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        {/* <Users /> */}
        <Notes data={data} />

        <input
          type="text"
          placeholder="write your note here"
          value={msg}
          onChange={(e: React.FormEvent<HTMLInputElement>) => setMsg(e.currentTarget.value)}
        />
        <input
          type="submit"
          onClick={(e) => {e.preventDefault(); saveMessage(); setMsg("")}}
          name="submit"
          value="submit"
        />
      </div>
    </ApolloProvider>
   
  );
}

export default App;
