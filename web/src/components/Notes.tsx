import NoteCard from './NoteCard'
import { gql, useLazyQuery } from '@apollo/client'

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

  const [getNotes, { called, loading, data }] = useLazyQuery(NOTES_QUERY)
  if (called && loading) return <p>Loading ...</p>

  return !data ? (<button onClick={() => getNotes()}>Get Notes</button>) : (
    <div>
      {data.userNotes[0].notes.map((d: UserNotes) => {
        return (
          <NoteCard data={d} />
        )
      })}
    </div>
  )
}

export default Notes
