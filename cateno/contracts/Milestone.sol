pragma solidity ^0.4.18;
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract Milestone is usingOraclize {

    uint256 public EURGBP;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewOraclizeQuery(string description);

    function Milestone() payable {
        LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Oraclize Query.");
        OAR = OraclizeAddrResolverI(0x6Dc9e7e04ECe4Cb0b63Fb5fD0b0aCb27bd0d66c0);
    }

    function()public payable{}

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) revert();
        EURGBP = parseInt(result);
        LogPriceUpdated(result);
    }

    function updatePrice() payable {
        if (oraclize_getPrice("URL") > this.balance) {
            LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query("URL", "json(https://3618a6b5.ngrok.io/api/qq).target");
        }
    }
}