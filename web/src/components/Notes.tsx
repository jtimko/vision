import React from 'react'
import NoteCard from './NoteCard'
import { UserData } from '../App'

const Notes = (props: {data: UserData[] }) => {
    return (
        <div>
            <ul>
                {props.data.map((d) => <li>{<NoteCard data={d} />}</li>)}
            </ul>
        </div>
    )
}

export default Notes
