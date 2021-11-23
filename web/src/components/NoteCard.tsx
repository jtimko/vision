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

const NoteCard = (props : {data: NoteProp, update: any}) => {

    const [saveStatus] = useMutation(completeStatus)

    const changeStatus = async (id: number, newStatus: boolean) => {
        try {
            await saveStatus({variables: {noteId: id, completed: newStatus}});
            props.update()
        }
        catch (e){
            console.log(e)
        }
    }
    return (
        <div>
            <p style={{backgroundColor: !props.data.completed ? 'gray' : 'red'}}
                onClick={() => changeStatus(props.data.id, !props.data.completed)}
            >
                {props.data.note}
            </p>
        </div>
    )
}

export default NoteCard
