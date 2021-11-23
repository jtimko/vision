import NoteCard from './NoteCard'

interface NoteProp {
  id: number;
  note: string;
  completed: boolean;
}

const ShowNotes = (props: {data: any, updateNotes: any}) => {
    return (
        <div>
            {props.data.allNotes[0].notes.map((d: NoteProp) => {
                return (
                    <NoteCard data={d} update={props.updateNotes} />
                )
            })}
        </div>
    )
}

export default ShowNotes
