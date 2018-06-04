pragma solidity ^0.4.18;
import "./oraclizeAPI.sol";

/*
 * @title Supervised Wallet - investor can supervise and authorize how company use their money
 * @author Chun-Wei Chiang - <warrior.sp@gmail.com>
 */
contract Milestone is usingOraclize {

    uint256 public EURGBP;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewOraclizeQuery(string description);

    function Milestone() payable {
        LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Oraclize Query.");
        OAR = OraclizeAddrResolverI(0xbd9beDb2c40AA5D769cBe3569a31fc012b6fCd3B);

    }

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
            oraclize_query("URL", "json(http://898659f8.ngrok.io/api/qq).target");
        }
    }
}