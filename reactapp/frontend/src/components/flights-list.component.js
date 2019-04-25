import React, {Component} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import './flights-list.component.css';

const FlightAction = (props) => {
    var userCanChangeToThisFlight = props.userData.booked_flight !== props.flight._id && props.userData.booked_flight;
    
    if(props.userData.is_airline) {
        return null;
    }

    if (!props.userData.booked_flight) {
      return <button className="link-button" onClick={() => props.onBookFlightClicked(props.flight._id, props.flight.flight_cost, props.flight.flight_airline)}>Book Flight</button>;
    }
    else if (userCanChangeToThisFlight) {
      return <button className="link-button" onClick={() => props.onChangeFlightClicked(props.flight._id, props.flight.flight_cost, props.flight.flight_airline)}>Change Flight</button>;
    }
  };

const Flight = props => (
    <tr>
        <td>{new Date(props.flight.flight_departure).toLocaleDateString()}</td>
        <td>{props.flight.flight_airline}</td>
        <td>{props.flight.flight_origin}</td>
        <td>{props.flight.flight_destination}</td>
        <td>{new Date(props.flight.flight_departure).toLocaleTimeString()}</td>
        <td>{props.flight.flight_cost}</td>
        <td>
            { FlightAction(props) }
        </td>
    </tr>
)

class FlightsList extends Component {

    constructor(props) {
        super(props);

        this.state = { flights: [] };
    }

    reloadFlightList() {
        axios.get('http://localhost:4000/flights/')
        .then(res => {
            this.setState({ flights: res.data });
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    componentDidMount() {
        this.reloadFlightList();
    }

    //Memory leak fix
    componentDidUpdate() {
        this.reloadFlightList();
    }

    flightList() {
        return this.state.flights.map((currentFlight, i) => {
            return <Flight flight={currentFlight} key={i} onBookFlightClicked={this.props.onFlightBooked} onChangeFlightClicked={this.props.onFlightChanged} userData={this.props.userData} />;
        });
    }

    render() {
        return (
            <div>
                <h3 style={{ marginTop: 20 }}>Flights List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Airline</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Departure Time</th>
                            <th>Price</th>
                            { !this.props.userData.is_airline && <th>Action</th> }
                        </tr>
                    </thead>
                    <tbody>
                        { this.flightList() }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withRouter(FlightsList);