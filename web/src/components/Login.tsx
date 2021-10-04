import React from 'react'
import {gql, useMutation} from '@apollo/client'
import { useHistory } from 'react-router'

const Login = () => {
    const LOGIN_MUTATION = gql`
        mutation login($email: string!, $password: string!) {
            login(email: $email, password: $password) {
                token
            }
        }
    `

    const [login, { data }] = useMutation(LOGIN_MUTATION)
    const history = useHistory()
    return (
        
        <div>
            <form 
            
            onSubmit={async (values) => {
					const response = await login({
						variables: values
					})
					localStorage.setItem("token", response.data.login.token)
					history.push("/users")
				}}>
			    <input name="email" type="text" placeholder="Email" />
				<input name="password" type="password" placeholder="Password" />
				<button type="submit" className="login-button">
					<span>Login</span>
				</button>
            </form>
            
        </div>
    )
}

export default Login
