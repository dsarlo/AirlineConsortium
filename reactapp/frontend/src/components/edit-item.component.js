import React, {Component} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class EditItem extends Component {

    constructor(props) {
        super(props);

        //Bind events
        this.onItemDescriptionChanged = this.onItemDescriptionChanged.bind(this);
        this.onItemPriceChanged = this.onItemPriceChanged.bind(this);
        this.onItemStatusChanged = this.onItemStatusChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            item_description: '',
            item_price: '',
            item_status: ''
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/items/' + this.props.match.params.id)
        .then(res => {
            this.setState({ 
                item_description: res.data.item_description,
                item_price: res.data.item_price,
                item_status: res.data.item_status 
            });
        })
        .catch(function(error) {
            console.log(error);
        });
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

    onItemStatusChanged(event) {
        this.setState( {
            item_status: event.target.value
        });
    }

    onSubmit(event) {
        event.preventDefault();

        const newItem = {
            item_description: this.state.item_description,
            item_price: this.state.item_price,
            item_status: this.state.item_status
        }

        axios.post("http://localhost:4000/items/update/" + this.props.match.params.id, newItem)
             .then(res => console.log(res.data));

        console.log(`Form submitted:`)
        console.log(`Item Description: ${this.state.item_description}`)
        console.log(`Item Price: ${this.state.item_price}`)
        console.log(`Item Status: ${this.state.item_status}`)

        this.setState({
            item_description: '',
            item_price: '',
            item_status: ''
        });

        this.props.history.push('/items');
    }

    render() {
        return (
            <div style={{ marginTop: 20 }} >
                <h3>Edit Item</h3>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }}>
                    <div className="form-group">
                        <label>Description: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.item_description } 
                               onChange={ this.onItemDescriptionChanged } 
                        />

                        <label>Price: </label>
                        <input type="number" 
                               className="form-control" 
                               value={ this.state.item_price } 
                               onChange={ this.onItemPriceChanged } 
                        />

                        <label>Status: </label>
                        <input type="text" 
                               className="form-control" 
                               value={ this.state.item_status } 
                               onChange={ this.onItemStatusChanged } 
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(EditItem);