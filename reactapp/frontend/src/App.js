import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import axios from 'axios';
import {withRouter} from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';

import FlightsList from "./components/flights-list.component";
import Register from "./components/register.component";
import Login from "./components/login.component";
import CreateFlight from "./components/create-flight.component";

import web3 from "./web3";
import airlineConsortium from "./airlineConsortium";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null
    }
  }

  signIn(username, first_name, last_name, balance, booked_flight, is_airline) {
    this.setState({user: {
      first_name,
      last_name,
      username,
      balance,
      booked_flight,
      is_airline
    }});

    console.log(first_name);
    console.log(username);
    console.log(last_name);
    console.log(balance);
    console.log(booked_flight);
    console.log(is_airline);
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
  isAirline = () => this.state.user.is_airline;

  //This is used as a callback for when an flight is booked
  //so that the current user identity can be updated from
  //the child component flights-list
  onFlightBooked(flight_id, flight_cost, flight_airline) {

    axios.get('http://localhost:4000/user/airlines/' + flight_airline)
    .then(async airlineData => {
      const airlineAddress = airlineData.data.sc_address;

      const accounts = await web3.eth.getAccounts();

      //Book flight with airline of choice
      await airlineConsortium.methods.bookFlight(airlineAddress, flight_cost).send({ from: accounts[0] });
      
      const updatedUserBalance = await airlineConsortium.methods.userBalances(accounts[0]).call();
      console.log(updatedUserBalance);

      let currentUser = Object.assign({}, this.state.user);
      currentUser.balance = updatedUserBalance;
      currentUser.booked_flight = flight_id;

      this.setState({
        user: currentUser
      }, function() {
        console.log(this.state.user.balance);
        //Update user balance in db
        axios.post("http://localhost:4000/user/updateBalance/" + this.state.user.username, this.state.user)
        .then(res => console.log(res.data));
      });

      //TODO update airline balance
    })
    .catch(function(error) {
        console.log(error);
    });
  }

  //This is used as a callback for when a flight change is requested by the user
  //so that the current user identity can be updated from
  //the child component flights-list
  onFlightChanged(newFlightId, newFlightCost, newFlightAirline) {
    let originalFlightId = this.state.user.booked_flight; //Use original flight id to get the sc_address for that airline

    axios.get('http://localhost:4000/flights/' + originalFlightId)
    .then(async originalFlightLookupResponse => {//Get the airline name and the flight cost for the original flight
      let originalAirline = originalFlightLookupResponse.data.flight_airline;
      let originalFlightCost = originalFlightLookupResponse.data.flight_cost;
      
      axios.get('http://localhost:4000/user/airlines/' + originalAirline)
      .then(async originalAirlineData => {//Get the original airline's sc address
        let originalAirlineUser = Object.assign({}, originalAirlineData.data);
        delete originalAirlineUser._id;

        const originalAirlineAddress = originalAirlineData.data.sc_address;
        
        axios.get('http://localhost:4000/user/airlines/' + newFlightAirline)
        .then(async newAirlineData => {//Get the new airline's sc address
          let newAirlineUser = Object.assign({}, newAirlineData.data);
          delete newAirlineUser._id;
          const newAirlineAddress = newAirlineData.data.sc_address;
          
          const accounts = await web3.eth.getAccounts();

          //Request to change flight
          await airlineConsortium.methods.requestFlightChange(originalAirlineAddress, newAirlineAddress, originalFlightCost, newFlightCost).send({ from: accounts[0] });
      
          const updatedUserBalance = await airlineConsortium.methods.userBalances(accounts[0]).call();
          console.log(updatedUserBalance);

          //Update the current user's balance...
          let currentUser = Object.assign({}, this.state.user);
          currentUser.balance = updatedUserBalance;
          currentUser.booked_flight = newFlightId;

          this.setState({
            user: currentUser
          }, function() {
            console.log(this.state.user.balance);
            //Update user balance in db
            axios.post("http://localhost:4000/user/updateBalance/" + this.state.user.username, this.state.user)
            .then(res => console.log(res.data));
          });

          //For updating airline balances
          if(originalAirlineAddress === newAirlineAddress) {//Update airline balance
            const updatedOriginalAirlineBalance = await airlineConsortium.methods.airlineBalances(originalAirlineAddress).call();

            //Update airline balance...
            originalAirlineUser.balance = updatedOriginalAirlineBalance;

            //Update airline balance in db
            axios.post("http://localhost:4000/user/updateBalance/" + originalAirlineUser.username, originalAirlineUser)
            .then(res => console.log(res.data));

          } else {//Update both airlines balances
            const updatedOriginalAirlineBalance = await airlineConsortium.methods.airlineBalances(originalAirlineAddress).call();
            const updatedNewAirlineBalance = await airlineConsortium.methods.airlineBalances(newAirlineAddress).call();

            //Update airline A balance...
            originalAirlineUser.balance = updatedOriginalAirlineBalance;

            //Update airline A balance in db
            axios.post("http://localhost:4000/user/updateBalance/" + originalAirlineUser.username, originalAirlineUser)
            .then(res => console.log(res.data));

            //Update airline B balance...
            newAirlineUser.balance = updatedNewAirlineBalance;

            //Update airline B balance in db
            axios.post("http://localhost:4000/user/updateBalance/" + newAirlineUser.username, newAirlineUser)
            .then(res => console.log(res.data));
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ width: '100%' }}>
          <a className="navbar-brand" href="/">ASK Blockchain (CSE 426)</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              { this.isAuthenticated() && <li className="navbar-item">
                <Link to="/flights" className="nav-link">Flights</Link>
              </li> }
              { this.isAuthenticated() && this.isAirline() && <li className="navbar-item">
                <Link to="/create" className="nav-link">Create Flight</Link>
              </li> }
              { this.isAuthenticated() && <li className="navbar-item">
                <button className="nav-link nav-button" onClick={() => this.signOut()}>Sign Out</button>
              </li> }
              { !this.isAuthenticated() && <li className="navbar-item">
                <Link to="/" className="nav-link">Sign In</Link>
              </li> }
              { !this.isAuthenticated() && <li className="navbar-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li> }
            </ul>

            <ul className="navbar-nav ml-auto">
              { this.isAuthenticated() && <li className="navbar-item">
                <button className="nav-link nav-button">{
                  this.state.user.first_name + " " + this.state.user.last_name + 
                  " | Balance: " + this.state.user.balance
                  }</button>
              </li> 
            }
            </ul>
          </div>
        </nav>

        { !this.isAuthenticated() && <Route path="/" exact render={this.LoginPage}/> }
        { !this.isAuthenticated() && <Route path="/register" component={Register}/> }
        { this.isAuthenticated() && <Route path="/flights" render={(props) => <FlightsList {...props} userData={this.state.user} onFlightBooked={this.onFlightBooked.bind(this)} onFlightChanged={this.onFlightChanged.bind(this)} />}/> }
        { this.isAuthenticated() && this.isAirline() && <Route path="/create" render={(props) => <CreateFlight {...props} userData={this.state.user} />} /> }
      </div>
    );
  }
}

export default withRouter(App);
