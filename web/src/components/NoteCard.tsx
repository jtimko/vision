interface UserNotes {
    id: number
    note: string
}


const NoteCard = (props: {data: UserNotes}) => {
    return (
        <div style={{backgroundColor: 'red', height: '50px', width: '300px', margin: '10px'}}>
            { props.data.note }
        </div>
    )
}

export default NoteCard
