pragma solidity ^0.4.24;

contract AirlineConsortium {

    //Start old contract (For tests)
    mapping (address => uint256) public balanceOf;

    constructor (uint256 initialSupply) public {
        balanceOf[msg.sender] = initialSupply;
    }

    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }
    //End old contract
    
    mapping (address => uint) userBalances;
    mapping (address => bool) userAccounts;
    
    //Chairperson is initialized as the creator of the smart contract
    address chairpersonAddress = msg.sender;
    uint chairpersonBalance = 0;
    
    modifier onlyChairperson()
    {
        require(msg.sender == chairpersonAddress);
        //This will be replaced with the function body the modifier is used on...
        _;
    }

    //Users can register themselves on the front-end
    //Add 500 to user balance and mark the account as created
    function register() public {
        //The user who is registering
        address user = msg.sender;
        
        userBalances[user] += 500;
        userAccounts[user] = true;
    }
    
    //Reset balance and mark the account as not registered
    function unregister(address userToUnregister) public onlyChairperson {
        chairpersonBalance += userBalances[userToUnregister];
        userBalances[userToUnregister] = 0;
        userAccounts[userToUnregister] = false;
    }
    
    //Takes money from the buyer and adds it to the seller
    function settlePayment(address buyerAddr, address sellerAddr, uint itemPrice) public {
        userBalances[buyerAddr] -= itemPrice;
        userBalances[sellerAddr] += itemPrice;
    }
    
    /*function request(address sellerAddr, uint itemPrice) public {
        address buyerAddr = msg.sender;
        
        if(userBalances[buyerAddr] >= itemPrice) {
            settlePayment(buyerAddr, sellerAddr, itemPrice);
        }
    }

    function response(address sellerAddr, uint itemPrice) public {
        address buyerAddr = msg.sender;
        
        if(userBalances[buyerAddr] >= itemPrice) {
            settlePayment(buyerAddr, sellerAddr, itemPrice);
        }
    }*/
}