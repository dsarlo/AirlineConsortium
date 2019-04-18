import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import './items-list.component.css';

const Item = props => (
    <tr>
        <td>{props.item.item_description}</td>
        <td>{props.item.item_price}</td>
        <td>{props.item.item_status}</td>
        <td>{props.item.item_owner}</td>
        <td>
            <button className="link-button" onClick={() => props.onBuyItemClicked(props.item._id, props.item.item_price)}>Buy Item</button>
        </td>
        <td>
            <Link to={ "/edit/" + props.item._id }>Edit</Link>
        </td>
    </tr>
)

class ItemsList extends Component {

    constructor(props) {
        super(props);

        this.state = { items: [] };
    }

    reloadItemList() {
        axios.get('http://localhost:4000/items/')
        .then(res => {
            this.setState({ items: res.data });
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    componentDidMount() {
        this.reloadItemList();
    }

    //Memory leak fix
    componentDidUpdate() {
        this.reloadItemList();
    }

    itemList() {
        return this.state.items.map((currentItem, i) => {
            return <Item item={currentItem} key={i} onBuyItemClicked={this.props.onItemBought} />;
        });
    }

    render() {
        return (
            <div>
                <h3 style={{ marginTop: 20 }}>Items List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Owner</th>
                            <th>Action</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.itemList() }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withRouter(ItemsList);