import React from 'react'
import { UserData } from '../App'

const NoteCard = (props: {data: UserData}) => {
    return (
        <div style={{backgroundColor: 'red', height: '50px', width: '300px', margin: '10px'}}>
            {props.data.message}
        </div>
    )
}

export default NoteCard
