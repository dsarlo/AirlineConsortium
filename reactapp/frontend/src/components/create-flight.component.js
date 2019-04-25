import React, {Component} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class CreateItem extends Component {

    constructor(props) {
        super(props);

        //Bind events
        this.onFlightOriginChanged = this.onFlightOriginChanged.bind(this);
        this.onFlightDestinationChanged = this.onFlightDestinationChanged.bind(this);
        this.onFlightDepartureChanged = this.onFlightDepartureChanged.bind(this);
        this.onFlightCostChanged = this.onFlightCostChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        console.log(this.props.userData);
        this.state = {
            user: this.props.userData,
            flight_origin: '',
            flight_destination: '',
            flight_airline: this.props.userData.first_name,
            flight_departure: '',
            flight_cost: ''
        }
    }

    onFlightOriginChanged(event) {
        this.setState( {
            flight_origin: event.target.value
        });
    }

    onFlightDestinationChanged(event) {
        this.setState( {
            flight_destination: event.target.value
        });
    }

    onFlightDepartureChanged(event) {
        this.setState( {
            flight_departure: event.target.value
        });
    }

    onFlightCostChanged(event) {
        this.setState( {
            flight_cost: event.target.value
        });
    }

    onSubmit(event) {
        event.preventDefault();

        const newFlight = {
            flight_origin: this.state.flight_origin,
            flight_destination: this.state.flight_destination,
            flight_airline: this.state.flight_airline,
            flight_departure: this.state.flight_departure,
            flight_cost: this.state.flight_cost
        }

        axios.post("http://localhost:4000/flights/add", newFlight)
             .then(res => console.log(res.data));

        console.log(`Form submitted:`)
        console.log(`Flight Origin: ${this.state.flight_origin}`)
        console.log(`Flight Destination: ${this.state.flight_destination}`)
        console.log(`Flight Airline: ${this.state.flight_airline}`)
        console.log(`Flight Departure: ${this.state.flight_departure}`)
        console.log(`Flight Cost: ${this.state.flight_cost}`)

        this.setState({
            flight_origin: '',
            flight_destination: '',
            flight_airline: '',
            flight_departure: '',
            flight_cost: ''
        });

        this.props.history.push('/flights');
    }

    areItemDetailsNotComplete = () => !!this.state.flight_origin && !!this.state.flight_destination && !!this.state.flight_departure && !!this.state.flight_cost;

    render() {
        return (
            <div style={{ marginTop: 20 }} >
                <h3>Create New Flight</h3>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }}>
                    <div className="form-group">
                        <label>Origin: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.flight_origin } 
                               onChange={ this.onFlightOriginChanged } 
                        />

                        <label style={{ marginTop: 5 }}>Destination: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.flight_destination } 
                               onChange={ this.onFlightDestinationChanged } 
                        />

                        <label style={{ marginTop: 5 }}>Departure: </label>
                        <input type="datetime-local"
                               className="form-control" 
                               value={ this.state.flight_departure } 
                               onChange={ this.onFlightDepartureChanged } 
                        />

                        <label style={{ marginTop: 5 }}>Cost: </label>
                        <input type="number" 
                               className="form-control" 
                               value={ this.state.flight_cost } 
                               onChange={ this.onFlightCostChanged } 
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Flight" disabled={!this.areItemDetailsNotComplete()} className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(CreateItem);