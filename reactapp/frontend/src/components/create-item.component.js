import React, {Component} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class CreateItem extends Component {

    constructor(props) {
        super(props);

        //Bind events
        this.onItemDescriptionChanged = this.onItemDescriptionChanged.bind(this);
        this.onItemPriceChanged = this.onItemPriceChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        console.log(this.props.userData);
        this.state = {
            user: this.props.userData,
            item_owner: '',
            item_description: '',
            item_price: '',
            item_status: 'Selling'
        }
    }

    onItemDescriptionChanged(event) {
        this.setState( {
            item_description: event.target.value
        });
    }

    onItemPriceChanged(event) {
        this.setState( {
            item_price: event.target.value
        });
    }

    onSubmit(event) {
        event.preventDefault();

        const newItem = {
            item_description: this.state.item_description,
            item_price: this.state.item_price,
            item_status: this.state.item_status,
            item_owner: this.state.user.username
        }

        axios.post("http://localhost:4000/items/add", newItem)
             .then(res => console.log(res.data));

        console.log(`Form submitted:`)
        console.log(`Item Description: ${this.state.item_description}`)
        console.log(`Item Price: ${this.state.item_price}`)
        console.log(`Item Status: ${this.state.item_status}`)

        this.setState({
            item_description: '',
            item_price: '',
            item_owner: '',
            item_status: 'Selling'
        });

        this.props.history.push('/items');
    }

    areItemDetailsNotComplete = () => !!this.state.item_description && !!this.state.item_price;

    render() {
        return (
            <div style={{ marginTop: 20 }} >
                <h3>Create New Item</h3>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }}>
                    <div className="form-group">
                        <label>Description: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.item_description } 
                               onChange={ this.onItemDescriptionChanged } 
                        />

                        <label style={{ marginTop: 5 }}>Price: </label>
                        <input type="number" 
                               className="form-control" 
                               value={ this.state.item_price } 
                               onChange={ this.onItemPriceChanged } 
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Item" disabled={!this.areItemDetailsNotComplete()} className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(CreateItem);