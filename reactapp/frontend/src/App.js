import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import axios from 'axios';
import {withRouter} from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';

import CreateItem from "./components/create-item.component";
import EditItem from "./components/edit-item.component";
import ItemsList from "./components/items-list.component";
import Register from "./components/register.component";
import Login from "./components/login.component";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null
    }
  }

  signIn(username, first_name, last_name, balance) {
    this.setState({user: {
      first_name,
      last_name,
      username,
      balance
    }});

    console.log(first_name);
    console.log(username);
    console.log(last_name);
    console.log(balance);
  }
  
  //Sign out button clicked event
  signOut() {
    // clear out user from state
    this.setState({user: null})
    
    //redirect user to login page
    this.props.history.push("/");
  }
  
  LoginPage = (props) => {
    return (
      <Login onSignIn={this.signIn.bind(this)}/>
    );
  }

  isAuthenticated = () => !!this.state.user;

  //This is used as a callback for when an item is bought
  //so that the current user identity can be updated from
  //the child componenet items-list
  onItemBought(item_id, item_price) {
    let currentUser = Object.assign({}, this.state.user);
    currentUser.balance -= item_price;

    this.setState({
        user: currentUser
    }, function() {
        console.log(this.state.user.balance);
        //Update user balance in db
        axios.post("http://localhost:4000/user/updateBalance/" + this.state.user.username, this.state.user)
        .then(res => console.log(res.data));

        //Delete purchased item in db
        axios.delete('http://localhost:4000/items/bought/' + item_id)
        .then(res => {
            console.log("Item successfully purchased!");
        })
        .catch(function(error) {
            console.log(error);
        });
    });
}

  render() {
    return (
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ width: '100%' }}>
          <a className="navbar-brand" href="/">Blockchain (CSE 426)</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              { this.isAuthenticated(this.state.user) && <li className="navbar-item">
                <Link to="/items" className="nav-link">Items</Link>
              </li> }
              { this.isAuthenticated(this.state.user) && <li className="navbar-item">
                <Link to="/create" className="nav-link">Create Item</Link>
              </li> }
              { this.isAuthenticated(this.state.user) && <li className="navbar-item">
                <button className="nav-link nav-button" onClick={() => this.signOut()}>Sign Out</button>
              </li> }
              { !this.isAuthenticated(this.state.user) && <li className="navbar-item">
                <Link to="/" className="nav-link">Sign In</Link>
              </li> }
              { !this.isAuthenticated(this.state.user) && <li className="navbar-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li> }
            </ul>

            <ul className="navbar-nav ml-auto">
              { this.isAuthenticated(this.state.user) && <li className="navbar-item">
                <button className="nav-link nav-button">{
                  this.state.user.first_name + " " + this.state.user.last_name + 
                  " | Balance: " + this.state.user.balance
                  }</button>
              </li> 
            }
            </ul>
          </div>
        </nav>

        { !this.isAuthenticated(this.state.user) && <Route path="/" exact render={this.LoginPage}/> }
        { !this.isAuthenticated(this.state.user) && <Route path="/register" component={Register}/> }
        { this.isAuthenticated(this.state.user) && <Route path="/items" render={(props) => <ItemsList {...props} userData={this.state.user} onItemBought={this.onItemBought.bind(this)} />}/> }
        { this.isAuthenticated(this.state.user) && <Route path="/edit/:id" render={(props) => <EditItem {...props} userData={this.state.user} />}/> }
        { this.isAuthenticated(this.state.user) && <Route path="/create" render={(props) => <CreateItem {...props} userData={this.state.user} />} /> }
      </div>
    );
  }
}

export default withRouter(App);
