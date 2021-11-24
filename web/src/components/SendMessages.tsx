import { useState, useRef, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client';

const SendMessages = (props: { updatedNotes: () => void}) => {

    const [msg, setMsg] = useState<string>();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const SAVENOTE = gql`
        mutation Mutation($note: String) {
            saveNote(note: $note) {
            id
            }
        }      
    `
    const [saveNote] = useMutation(SAVENOTE);

    const onchange = () => {
        setMsg(String(inputRef.current?.value));

        console.log(msg)

        if (inputRef.current)
            inputRef.current.value = "";
        inputRef.current?.focus()
    }

    useEffect(() => {
        const saveDetails = async() => {
            try {
                await saveNote({ variables: { note: msg }})
                console.log('triggered')
            }
            catch (e){
                 console.log(e)
            }
        }
        saveDetails();
        props.updatedNotes()
    }, [msg])

    return (
        <div>
            <input
                type="text"
                //onChange={(e) => setMsg(e.currentTarget.value)}
                ref={inputRef}
            />
            <button onClick={onchange}>Submit</button>
        </div>
    )
}

export default SendMessages
