import React from 'react'
import NoteCard from './NoteCard'
import { UserData } from '../App'
import { gql, useQuery } from '@apollo/client'
import internal from 'stream'

const NOTES_QUERY = gql`
  query NOTES_QUERY {
    userNotes {
      notes {
        note
        id
      }
    }
  }
`

interface UserNotes {
    id: number
    note: string
}

const Notes = () => {
    const {loading, error, data} = useQuery(NOTES_QUERY)
    if (loading) return <p>Loading..</p>
    if (error) return <p>Error..</p>
    console.debug(data.userNotes)
    return (
        <div>
            <ul>
                {/* {props.data.map((d) => <li>{<NoteCard data={d} />}</li>)} */}
                {/* { data.userNotes.map((d: UserNotes) => <li>{<NoteCard data={d} />}</li>)} */}
                {data.userNotes.map((d: UserNotes) => {
                  //console.log("d: " + JSON.stringify(d))

                  return (
                    <p>{d.note}</p>
                  )
                })}
            </ul>
        </div>
    )
}

export default Notes
