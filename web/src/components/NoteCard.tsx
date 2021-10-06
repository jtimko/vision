import React from 'react'
import { UserData } from '../App'

interface UserNotes {
    id: number
    note: string
}


const NoteCard = (props: {data: UserNotes}) => {
    return (
        <div style={{backgroundColor: 'red', height: '50px', width: '300px', margin: '10px'}}>
            {/* {props.data.message} */}
            { console.log("Notes:" + JSON.stringify(props.data.note)) }

            { props.data.note }
        </div>
    )
}

export default NoteCard
