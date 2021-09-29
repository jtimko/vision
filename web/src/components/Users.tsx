import React from 'react'
import {gql, useQuery} from '@apollo/client'

const USERS_QUERY = gql`
query USERS_QUERY {
    users{
        id
        name
        email
    }
}
`

interface User  {
    name: string
    id: number
    email: string
}

const Users = () => {
    const {loading, error, data} = useQuery(USERS_QUERY)

    if(loading) return <p>Loading...</p>
    if(error) return <p>{error.message}</p>

    return (
        <div>
            {console.log(data.users)}
            {data.users.map((user: User) => {
                return (
                    <p>{user.email}</p>
                )
            })}
        </div>
    )
}

export default Users
