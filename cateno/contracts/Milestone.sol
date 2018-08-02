pragma solidity ^0.4.18;
import "./oraclizeAPI.sol";

contract Milestone is usingOraclize {

    uint256 public EURGBP;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewOraclizeQuery(string description);

    function Milestone() payable{
        LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Oraclize Query.");
        OAR = OraclizeAddrResolverI(0xb8e72A4c11AA00073E7C2ED39ca513dc8bd0a291);
    }

    function()public payable{}

    function __callback(bytes32 myid, string result) {
        // if (msg.sender != oraclize_cbAddress()) revert();
        EURGBP = parseInt(result);
        LogPriceUpdated(result);
    }

    function updatePrice() payable {
        if (oraclize_getPrice("URL") > this.balance) {
            LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query("URL", "json(http://cateno.localtunnel.me/api/rr).target");
        }
    }
}