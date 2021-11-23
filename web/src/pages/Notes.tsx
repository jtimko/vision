import ShowNotes from "../components/ShowNotes"
import SendMessages from "../components/SendMessages"
import { useQuery, gql } from "@apollo/client"

const GETUSERNOTES = gql`
query Query {
  allNotes {
    notes {
      id
      note
      completed
    }
  }
}
`

const Notes = () => {
    const {data, refetch } = useQuery(GETUSERNOTES);

    const updateNotes = () => {
        refetch()
    }

    return (
        <div style={{backgroundColor: '#8ac6d1', width: '400px', margin: 'auto', padding: '20px'}}>
            {data && <ShowNotes data={data} updateNotes={updateNotes} /> }
            <SendMessages updatedNotes={updateNotes} />
        </div>
    )
}

export default Notes
