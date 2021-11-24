import { gql, useMutation } from '@apollo/client'

interface NoteProp {
    id: number;
    note: string;
    completed: boolean;
  }

const completeStatus = gql`
mutation Mutation($noteId: Int, $completed: Boolean) {
    changeStatus(noteId: $noteId, completed: $completed) {
      note
    }
  }
`

const deleteNoteById = gql`
mutation Mutation($noteId: Int) {
    deleteNote(noteId: $noteId) {
      id
    }
  }
`

const NoteCard = (props : {data: NoteProp, update: any}) => {

    const [saveStatus] = useMutation(completeStatus)
    const [deleteNote] = useMutation(deleteNoteById)

    const changeStatus = async (id: number, newStatus: boolean) => {
        try {
            await saveStatus({variables: {noteId: id, completed: newStatus}});
            props.update()
        }
        catch (e){
            console.log(e)
        }
    }

    const delNote = async (id: number) => {
        try {
            await deleteNote({variables: {noteId: id} })
            props.update()
        }
        catch (e) {
            console.log(e)
        }
    }
    return (
        <div style={{backgroundColor: !props.data.completed ? '#ffb6b9' : '#d1d9e3', padding: '0 10px', borderRadius: '5px', textDecorationLine: props.data.completed ? 'line-through' : '' }}>
            <p onClick={() => changeStatus(props.data.id, !props.data.completed)}>
                {props.data.note}
                <button onClick={() => delNote(props.data.id)}>Del</button>
            </p>
        </div>
    )
}

export default NoteCard
