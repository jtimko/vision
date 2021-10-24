import { gql, useMutation } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"

const LOGIN_MUTATION = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
		}
	}
`

interface LoginValues {
	email: string
	password: string
}

function Login() {
	const history = useHistory()
	const [ login, { data } ] = useMutation(LOGIN_MUTATION)

	console.log(data) // do not keep
	const initialValues: LoginValues = {
		email: "",
		password: ""
	}

	const validationSchema = Yup.object({
		email: Yup.string().email("Invalid email address").required("Email Required"),
		password: Yup.string().max(20, "Must be 20 characters or less").required("Password Required")
	})

	return (
		<div className="container">
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setSubmitting(true)
					const response = await login({
						variables: values
					})
					localStorage.setItem("token", response.data.login.token)
					setSubmitting(false)
					history.push("/notes")
				}}
			>
				<Form>
					<Field name="email" type="text" placeholder="Email" />
					<ErrorMessage name="email" component={"div"} />

					<Field name="password" type="password" placeholder="Password" />
					<ErrorMessage name="password" component={"div"} />

					<button type="submit" className="login-button">
						<span>Login</span>
					</button>
				</Form>
			</Formik>
		</div>
	)
}

export default Login


// import React from 'react'
// import {gql, useMutation} from '@apollo/client'
// import { useHistory } from 'react-router'

// const Login = () => {
//     const LOGIN_MUTATION = gql`
//         mutation login($email: string!, $password: string!) {
//             login(email: $email, password: $password) {
//                 token
//             }
//         }
//     `

//     const [login, { data }] = useMutation(LOGIN_MUTATION)
//     const history = useHistory()
//     return (
        
//         <div>
//             <form 
//                 onSubmit={async (values) => {
// 					const response = await login({
// 						variables: values
// 					})
// 					localStorage.setItem("token", response.data.login.token)
// 					history.push("/users")
// 				}}>
// 			    <input name="email" type="text" placeholder="Email" />
// 				<input name="password" type="password" placeholder="Password" />
// 				<button type="submit" className="login-button">
// 					<span>Login</span>
// 				</button>
//             </form>
            
//         </div>
//     )
// }

// export default Login
