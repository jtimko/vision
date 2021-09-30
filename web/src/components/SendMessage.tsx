import React, { useState } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useMutation } from '@apollo/client'

const SendMessage = (props: {saveMessage: any}) => {

    const MSG_QUERY = gql`
        mutation AddNotesMutation($note: String!, $id: Int!) {
            addNotes(note: $note, id: $id) {
                id
            }
        }
    `
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMjk2OTQ3Mn0.BBspkTy2BByi1O3wH7VNtSzo3RnuceGskaE_qhTVCyE"
    const client = new ApolloClient( {
        uri: "http://localhost:4000",
        cache: new InMemoryCache(),
        headers: {
            Authorization: `Bearer ${token}`
        }
      })
    
    const [addNotes] = useMutation(MSG_QUERY);
    const [msg, setMsg] = useState<string>();

    const dbSave = async() => {
        try {
            await addNotes( {variables: {note: msg, id: 1} })
        }
        catch (error) {
            console.log(error)
        }
    }
    
    return (
        <ApolloProvider client={client}>
            <div>
                <input
                    type="text"
                    placeholder="write your note here"
                    value={msg}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => setMsg(e.currentTarget.value)}
                />
                <input
                    type="submit"
                    onClick={(e) => {e.preventDefault(); dbSave(); props.saveMessage(msg); }}
                    name="submit"
                    value="submit"
                />
            </div>
        </ApolloProvider>
    )
}

export default SendMessage
