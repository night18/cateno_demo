pragma solidity ^0.4.18;

import "./MultiSigWallet.sol";
import "./Milestone.sol";

/*
 * @title Multisignature wallet with daily limit - Allows executor to withdraw a daily limit without multisig.
 * @author Chun-Wei Chiang - <warrior.sp@gmail.com>
 */
contract MultiSigWalletWithDailyLimit is MultiSigWallet, Milestone {

    /*
     *  Events
     */
    event DailyLimitChange(uint dailyLimit);

    /*
     *  Storage
     */
    uint public dailyLimit;
    uint public lastDay;
    uint public spentToday;
    uint[] private hasmilestone;
    mapping (uint => uint) public milestone_target;

    /*
     * Public functions
     * @dev Contract constructor sets initial owners, required number of confirmations and daily withdraw limit.
     * @param _owners List of initial owners.
     * @param _required Number of required confirmations.
     * @param _supervisors List of initial supervisors.
     * @param _dailyLimit Amount in "wei", which can be withdrawn without confirmations on a daily basis.
     */
    function MultiSigWalletWithDailyLimit(address _executor, address[] _supervisors, uint _required, uint _dailyLimit)
        public
        payable
        MultiSigWallet(_executor, _supervisors, _required)
    {
        dailyLimit = _dailyLimit;
    }
    
    /// @dev Allows to change the daily limit. Transaction has to be sent by wallet.
    /// @param _dailyLimit Amount in wei.
    function changeDailyLimit(uint _dailyLimit)
        public
        onlyWallet
    {
        dailyLimit = _dailyLimit;
        emit DailyLimitChange(_dailyLimit);
    }

    /// @dev Allows anyone to execute a confirmed transaction or ether withdraws until daily limit is reached.
    /// @param transactionId Transaction ID.
    function executeDailyTransaction(uint transactionId)
        public
        isExecutor(msg.sender)
        notExecuted(transactionId)
    {
        Transaction storage txn = transactions[transactionId];
        bool _confirmed = isConfirmed(transactionId);
        if (_confirmed || isUnderLimit(txn.value)) {
            txn.executed = true;
            if (!_confirmed)
                spentToday += txn.value;
            if (txn.destination.send(txn.value))
                emit Execution(transactionId);
            else {
                emit ExecutionFailure(transactionId);
                txn.executed = false;
                if (!_confirmed)
                    spentToday -= txn.value;
            }
        }
    }

    /// @dev Allows the executor to ask the request to submit a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @param reason The reason for the transaction.
    /// @param target The milestone target.
    /// @return Returns transaction ID.
    function settingMilestone(address destination, uint value, bytes data, bytes32 reason, uint target)
        public
        isExecutor(msg.sender)
        returns (uint transactionId)
    {
        transactionId = submitTransaction(destination, value,data, reason);
        hasmilestone.push(transactionId);
        milestone_target[transactionId] = target;
    }


    function checkMilestone()
        public
    {
        for(uint _Id = 0 ; _Id < hasmilestone.length; _Id++){
            if(EURGBP >= milestone_target[hasmilestone[_Id]]){
               executeMilestoneTransaction(hasmilestone[_Id]);
            }
        }
    }
    
    function executeMilestoneTransaction(uint transactionId)
        private
        
    {
        Transaction storage txn = transactions[transactionId];
        txn.executed = true;
        if (txn.destination.send(txn.value))
            emit Execution(transactionId);
        else {
            //emit ExecutionFailure(_Id);
            txn.executed = false;
        }
    }
    
    /*
     * Internal functions
     */
    /// @dev Returns if amount is within daily limit and resets spentToday after one day.
    /// @param amount Amount to withdraw.
    /// @return Returns if amount is under daily limit.
    function isUnderLimit(uint amount)
        internal
        returns (bool)
    {
        if (now > lastDay + 24 hours) {
            lastDay = now;
            spentToday = 0;
        }
        if (spentToday + amount > dailyLimit || spentToday + amount < spentToday)
            return false;
        return true;
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns maximum withdraw amount.
    /// @return Returns amount.
    function calcMaxWithdraw()
        public
        constant
        returns (uint)
    {
        if (now > lastDay + 24 hours)
            return dailyLimit;
        if (dailyLimit < spentToday)
            return 0;
        return dailyLimit - spentToday;
    }
}
