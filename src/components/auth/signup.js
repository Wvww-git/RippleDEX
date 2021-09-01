import React from "react";
// import { Form, Button, Card, Alert } from "react-bootstrap";
import { signup, isLoggedIn } from "../../utils/AuthFunctions";
import { navigate } from "gatsby"

class SignUp extends React.Component {

    state = {
        name: ``,
        email: ``,
        password: ``,
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        const uid = await signup(this.state.name, this.state.email, this.state.password, null)
        if ( uid == null ){
            // Fail to signup
            navigate(`/login`)
          }
        else {
          navigate(`/profile`)
        }
    }

    handleUpdate = event => {
      this.setState({
        [event.target.name]: event.target.value,
      })
    }

    render() {
      if (isLoggedIn()) {
        navigate(`/profile`)
      }
      return (
        <>
          <h1>Sign Up</h1>
          <form
            method="post"
            onSubmit={event => {
              this.handleSubmit(event)
            }}
          >
            <label>
              Name
              <input type="text" name="name" onChange={this.handleUpdate} />
            </label>
            <label>
              Email
              <input type="text" name="email" onChange={this.handleUpdate} />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                onChange={this.handleUpdate}
              />
            </label>
            <input type="submit" value="Sign Up" />
          </form>
        </>
      )
    }
}

export default SignUp;