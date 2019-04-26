pragma solidity ^0.4.24;

contract AirlineConsortium {
    
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

    //Called when user requests to change flights
    function requestFlightChange(address originalFlightAirlineAddr, address flightToChangeToAddr, uint originalFlightCost, uint flightCost) public {
        if(flightCost > originalFlightCost) { //Checks to make sure the user can cover the difference if the new flight is more expensive.
            require(userBalances[msg.sender] >= flightCost - originalFlightCost);
        }

        if(originalFlightAirlineAddr == flightToChangeToAddr) {//If booking with the same airline, just settle payment
            settlePayment(msg.sender, originalFlightAirlineAddr, flightToChangeToAddr, originalFlightCost, flightCost);
        } else {
            require(airlineBalances[originalFlightAirlineAddr] >= flightCost);//Checks to make sure Airline A has enough money to cover the cost of the flight change
            responseToFlightChange(msg.sender, originalFlightAirlineAddr, flightToChangeToAddr, originalFlightCost, flightCost);
        }
    }
    
    //Called when the user has made a request to change a flight and it has been passed to the next airline
    function responseToFlightChange(address userAddr, address originalFlightAirlineAddr, address flightToChangeToAddr, uint originalFlightCost, uint flightCost) public {
        settlePayment(userAddr, originalFlightAirlineAddr, flightToChangeToAddr, originalFlightCost, flightCost);
    }

    //Settles the payment between the user and the two airlines
    function settlePayment(address userAddr, address originalFlightAirlineAddr, address flightToChangeToAddr, uint originalFlightCost, uint flightCost) public {
        //Checks to see if we need to settle payment with 3rd party airline (Airline B) between A and B
        if(originalFlightAirlineAddr != flightToChangeToAddr) {//Basically, A pays B (airlines)
            airlineBalances[originalFlightAirlineAddr] -= flightCost;
            airlineBalances[flightToChangeToAddr] += flightCost;
        }

        //Settles the payment between Airline A and the User.
        if(flightCost < originalFlightCost) { //New flight is cheaper so user gets money back from Airline A
            uint ticketDiffCheaper = originalFlightCost - flightCost;
            require(airlineBalances[originalFlightAirlineAddr] >= ticketDiffCheaper);
            userBalances[userAddr] += ticketDiffCheaper;
            airlineBalances[originalFlightAirlineAddr] -= ticketDiffCheaper;
        }
        else if(flightCost > originalFlightCost) { //New flight is more money. User pays difference to Airline A
            uint ticketDiffMore = flightCost - originalFlightCost;
            require(userBalances[userAddr] >= ticketDiffMore);
            userBalances[userAddr] -= ticketDiffMore;
            airlineBalances[originalFlightAirlineAddr] += ticketDiffMore;
        }
    }
}