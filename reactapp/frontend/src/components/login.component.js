import React, {Component} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Login extends Component {

    constructor(props) {
        super(props);

        //Bind events
        this.onUsernameChanged = this.onUsernameChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);

        this.state = {
            username: '',
            password: ''
        }
    }

    handleSignIn(event) {
        event.preventDefault();

        axios.get('http://localhost:4000/user/login/' + this.state.username + "/" + this.state.password)
        .then(res => {
            this.props.onSignIn(res.data.username, res.data.first_name, res.data.last_name, res.data.balance, res.data.booked_flight, res.data.is_airline);
            this.props.history.push("/flights");
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    onUsernameChanged(event) {
        this.setState( {
            username: event.target.value
        });
    }

    onPasswordChanged(event) {
        this.setState( {
            password: event.target.value
        });
    }

    render() {
        return (
            <div style={{ marginTop: 20 }} >
                <h3>Sign In</h3>
                <form onSubmit={this.handleSignIn.bind(this)} style={{ marginTop: 20 }}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.username } 
                               onChange={ this.onUsernameChanged } 
                        />

                        <label style={{ marginTop: 5 }}>Password: </label>
                        <input type="password" 
                               className="form-control" 
                               value={ this.state.password } 
                               onChange={ this.onPasswordChanged } 
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(Login);