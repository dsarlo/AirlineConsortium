import React, {Component} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import './register.component.css';

class Register extends Component {

    constructor(props) {
        super(props);

        //Bind events
        this.onFirstNameChanged = this.onFirstNameChanged.bind(this);
        this.onLastNameChanged = this.onLastNameChanged.bind(this);
        this.onUsernameChanged = this.onUsernameChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onConfirmPassChanged = this.onConfirmPassChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            confirmedPass: '',
            first_name: '',
            last_name: ''
        }
    }

    onFirstNameChanged(event) {
        this.setState( {
            first_name: event.target.value
        });
    }

    onLastNameChanged(event) {
        this.setState( {
            last_name: event.target.value
        });
    }

    onConfirmPassChanged(event) {
        this.setState( {
            confirmedPass: event.target.value
        });
    }

    onPasswordChanged(event) {
        this.setState( {
            password: event.target.value
        });
    }

    onUsernameChanged(event) {
        this.setState( {
            username: event.target.value
        });
    }

    onSubmit(event) {
        event.preventDefault();

        const newUser = {
            username: this.state.username,
            password: this.state.password,
            balance: 500,
            first_name: this.state.first_name,
            last_name: this.state.last_name
        }

        axios.post("http://localhost:4000/user/registerUser", newUser)
             .then(res => console.log(res.data));

        this.setState({
            username: '',
            password: '',
            confirmedPass: '',
            first_name: '',
            last_name: ''
        });

        this.props.history.push('/');
    }

    arePasswordsSame = () => this.state.confirmedPass === this.state.password;
    areAnyInputsEmpty = () => !!this.state.password && !!this.state.confirmedPass && !!this.state.username && !!this.state.first_name && !!this.state.last_name;

    render() {
        return (
            <div style={{ marginTop: 20 }} >
                <h3>Registration</h3>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }}>
                    <div className="form-group">
                        <label>First Name: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.first_name } 
                               onChange={ this.onFirstNameChanged } 
                        />

                        <label style={{ marginTop: 5 }}>Last Name: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.last_name } 
                               onChange={ this.onLastNameChanged } 
                        />

                        <label style={{ marginTop: 5 }}>Username: </label>
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

                        <label style={{ marginTop: 5 }}>Confirm Password: </label>
                        {!this.arePasswordsSame() && <label className="red_label">Passwords do not match!</label>}
                        <input type="password" 
                               className="form-control" 
                               value={ this.state.confirmedPass } 
                               onChange={ this.onConfirmPassChanged } 
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register" disabled={!this.areAnyInputsEmpty()} className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(Register);