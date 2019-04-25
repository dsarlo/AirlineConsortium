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
    
    mapping (address => uint) public userBalances;
    mapping (address => bool) userAccounts;

    mapping (address => uint) public airlineBalances;
    mapping (address => bool) airlineAccounts;
    
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
    //Add 1000 to user balance and 10000 for airlines and mark the account as created
    function register(bool isAirline) public {
        if(isAirline) {
            airlineBalances[msg.sender] = 10000;
            airlineAccounts[msg.sender] = true;
        } else {
            userBalances[msg.sender] = 1000;
            userAccounts[msg.sender] = true;
        }
    }
    
    //Reset balance and mark the account as not registered
    function unregister(address userToUnregister, bool isAirline) public onlyChairperson {
        if(isAirline) {
            chairpersonBalance += airlineBalances[userToUnregister];
            airlineBalances[userToUnregister] = 0;
            airlineAccounts[userToUnregister] = false;
        } else {
            chairpersonBalance += userBalances[userToUnregister];
            userBalances[userToUnregister] = 0;
            userAccounts[userToUnregister] = false;
        }
    }

    //Takes money from the user who is booking the flight and adds it to the airlines balance
    function bookFlight(address airlineAddr, uint flightCost) public {
        require(userBalances[msg.sender] >= flightCost);
        userBalances[msg.sender] -= flightCost;
        airlineBalances[airlineAddr] += flightCost;
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