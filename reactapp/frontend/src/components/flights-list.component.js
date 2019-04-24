import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import './flights-list.component.css';

const FlightAction = (props) => {
    var userCanChangeToThisFlight = props.currentBookedFlightId !== props.flight._id && props.currentBookedFlightId;
  
    if (!props.currentBookedFlightId) {
      return <button className="link-button" onClick={() => props.onBookFlightClicked(props.flight._id, props.flight.flight_cost)}>Book Flight</button>;
    }
    else if (userCanChangeToThisFlight) {
      return <Link to={ "/edit/" + props.flight._id }>Change Flight</Link>;
    }
  };

const Flight = props => (
    <tr>
        <td>{new Date(props.flight.flight_board_time).toLocaleDateString()}</td>
        <td>{props.flight.flight_airline}</td>
        <td>{props.flight.flight_origin}</td>
        <td>{props.flight.flight_destination}</td>
        <td>{new Date(props.flight.flight_board_time).toLocaleTimeString()}</td>
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
            return <Flight flight={currentFlight} key={i} onBookFlightClicked={this.props.onFlightBooked} currentBookedFlightId={this.props.currentBookedFlightId} />;
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
                            <th>Action</th>
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