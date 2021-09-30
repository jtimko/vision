import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const SendMessage = (props: { saveMessage: any }) => {

    const MSG_QUERY = gql`
        mutation AddNotesMutation($note: String!, $id: Int!) {
            addNotes(note: $note, id: $id) {
                id
            }
        }
    `

    const [addNotes] = useMutation(MSG_QUERY);
    const [msg, setMsg] = useState<string>();

    const dbSave = async () => {
        try {
            await addNotes({ variables: { note: msg, id: 1 } })
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder="write your note here"
                value={msg}
                onChange={(e: React.FormEvent<HTMLInputElement>) => setMsg(e.currentTarget.value)}
            />
            <input
                type="submit"
                onClick={(e) => { e.preventDefault(); dbSave(); props.saveMessage(msg); }}
                name="submit"
                value="submit"
            />
        </div>
    )
}

export default SendMessage
