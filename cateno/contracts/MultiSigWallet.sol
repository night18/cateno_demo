pragma solidity ^0.4.18;


/*
 * @title Supervised Wallet - investor can supervise and authorize how company use their money
 * @author Chun-Wei Chiang - <warrior.sp@gmail.com>
 */
contract MultiSigWallet{

    /*
     *  Events
     */
    event Confirmation(address indexed sender, uint indexed transactionId);
    event Revocation(address indexed sender, uint indexed transactionId);
    event Submission(uint indexed transactionId);
    event Execution(uint indexed transactionId);
    event ExecutionFailure(uint indexed transactionId);
    event Deposit(address indexed sender, uint value);
    event SupervisorAddition(address indexed supervisor);
    event SupervisorRemoval(address indexed supervisor);
    event RequirementChange(uint required);

    /*
     *  Constants
     */
    uint constant private MAX_SUPERVISOR_COUNT = 50;

    /*
     *  Storage
     */
    mapping (uint => Transaction) public transactions;
    mapping (uint => mapping (address => bool)) private confirmations;
    mapping (address => bool) private isSupervisor;
    address private executor;
    address[] private supervisors;
    uint private required;
    uint private transactionCount;

    struct Transaction {
        address destination;
        uint value;
        bytes data;
        bytes32 reason;
        bool executed;
    }

    /*
     *  Modifiers
     */
    modifier onlyWallet() {
        require(msg.sender == address(this));
        _;
    }

    modifier isExecutor(address _sender) {
        require(_sender == executor);
        _;
    }

    modifier supervisorDoesNotExist(address supervisor) {
        require(!isSupervisor[supervisor]);
        _;
    }

    modifier supervisorExists(address supervisor) {
        require(isSupervisor[supervisor]);
        _;
    }

    modifier transactionExists(uint transactionId) {
        require(transactions[transactionId].destination != 0);
        _;
    }

    modifier confirmed(uint transactionId, address _supervisor) {
        require(confirmations[transactionId][_supervisor]);
        _;
    }

    modifier notConfirmed(uint transactionId, address _supervisor) {
        require(!confirmations[transactionId][_supervisor]);
        _;
    }

    modifier notExecuted(uint transactionId) {
        require(!transactions[transactionId].executed);
        _;
    }

    modifier notNull(address _address) {
        require(_address != 0);
        _;
    }

    modifier validRequirement(uint supervisorCount, uint _required) {
        require(supervisorCount <= MAX_SUPERVISOR_COUNT
            && _required <= supervisorCount
            && _required != 0
            && supervisorCount != 0);
        _;
    }

    /// @dev Fallback function allows to deposit ether.
    function()
        public
        payable
    {
        if (msg.value > 0)
            emit Deposit(msg.sender, msg.value);
    }

    /*
     * Public functions
     *
     * @dev Contract constructor sets initial executor, initial supervisors and required number of confirmations.
     * @param _executor The entity who has the right to request the use of funding. 
     * @param _supervisors List of initial supervisors.
     * @param _required Number of required confirmations.
     */
    function MultiSigWallet(address _executor, address[] _supervisors, uint _required)
        public
        payable
        notNull(_executor)
        validRequirement(_supervisors.length, _required)
        
    {
        for (uint i=0; i<_supervisors.length; i++) {
            require(!isSupervisor[_supervisors[i]] && _supervisors[i] != 0);
            isSupervisor[_supervisors[i]] = true;
        }
        executor = _executor;
        supervisors = _supervisors;
        required = _required;
    }

    /// @dev Allows to add a new supervisor. Transaction has to be sent by wallet.
    /// @param _supervisor Address of new supervisor.
    function addSupervisor(address _supervisor)
        public
        onlyWallet
        supervisorDoesNotExist(_supervisor)
        notNull(_supervisor)
        validRequirement(supervisors.length + 1, required)
    {
        isSupervisor[_supervisor] = true;
        supervisors.push(_supervisor);
        emit SupervisorAddition(_supervisor);
    }

    /// @dev Allows to remove an supervisor. Transaction has to be sent by wallet.
    /// @param _supervisor Address of supervisor.
    function removeSupervisor(address _supervisor)
        public
        onlyWallet
        supervisorExists(_supervisor)
    {
        isSupervisor[_supervisor] = false;
        for (uint i=0; i<supervisors.length - 1; i++){
            if (supervisors[i] == _supervisor) {
                supervisors[i] = supervisors[supervisors.length - 1];
                break;
            }
        }
            
        supervisors.length -= 1;
        if (required > supervisors.length){
            changeRequirement(supervisors.length);
        }
        emit SupervisorRemoval(_supervisor);
    }

    /// @dev Allows to replace an supervisor with a new supervisor. Transaction has to be sent by wallet and the new supervisort cannot be null.
    /// @param _supervisor Address of supervisor to be replaced.
    /// @param _newSupervisor Address of new supervisor.
    function replaceSupervisor(address _supervisor, address _newSupervisor)
        public
        onlyWallet
        supervisorExists(_supervisor)
        supervisorDoesNotExist(_newSupervisor)
        notNull(_newSupervisor)
    {
        for (uint i=0; i<supervisors.length; i++)
            if (supervisors[i] == _supervisor) {
                supervisors[i] = _newSupervisor;
                break;
            }
        isSupervisor[_supervisor] = false;
        isSupervisor[_newSupervisor] = true;
        emit SupervisorRemoval(_supervisor);
        emit SupervisorAddition(_newSupervisor);
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param _required Number of required confirmations.
    function changeRequirement(uint _required)
        public
        onlyWallet
        validRequirement(supervisors.length, _required)
    {
        required = _required;
        emit RequirementChange(_required);
    }

    /// @dev Allows the executor to ask the request to submit a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @param reason The reason for the transaction.
    /// @return Returns transaction ID.
    function submitTransaction(address destination, uint value, bytes data, bytes32 reason)
        public
        isExecutor(msg.sender)
        returns (uint transactionId)
    {
        transactionId = addTransaction(destination, value, data, reason);
        // confirmTransaction(transactionId);
    }

    /// @dev Allows an supervisor to confirm a transaction, if the confirmation meets the required than execute the transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint transactionId)
        public
        supervisorExists(msg.sender)
        transactionExists(transactionId)
        notConfirmed(transactionId, msg.sender)
    {
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }

    /// @dev Allows a supervisor to revoke his/her confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint transactionId)
        public
        supervisorExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        confirmations[transactionId][msg.sender] = false;
        emit Revocation(msg.sender, transactionId);
    }

    /// @dev Allows supervisor to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint transactionId)
        public
        supervisorExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction storage txn = transactions[transactionId];
            txn.executed = true;
            if (external_call(txn.destination, txn.value, txn.data.length, txn.data))
                emit Execution(transactionId);
            else {
                emit ExecutionFailure(transactionId);
                txn.executed = false;
            }
        }
    }

    // call has been separated into its own function in order to take advantage
    // of the Solidity's code generator to produce a loop that copies tx.data into memory.
    function external_call(address destination, uint value, uint dataLength, bytes data) 
        private 
        returns (bool) 
    {
        bool result;
        assembly {
            let x := mload(0x40)   // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
            let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
            result := call(
                sub(gas, 34710),   // 34710 is the value that solidity is currently emitting
                                   // It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
                                   // callNewAccountGas (25000, in case the destination address does not exist and needs creating)
                destination,
                value,
                d,
                dataLength,        // Size of the input (in bytes) - this is what fixes the padding problem
                x,
                0                  // Output is ignored, therefore the output size is zero
            )
        }
        return result;
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.(default: false)
    function isConfirmed(uint transactionId)
        public
        constant
        returns (bool)
    {
        uint count = 0;
        for (uint i=0; i<supervisors.length; i++) {
            if (confirmations[transactionId][supervisors[i]])
                count += 1;
            if (count == required)
                return true;
        }
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @param reason The reason for the transaction.
    /// @return Returns transaction ID.
    function addTransaction(address destination, uint value, bytes data, bytes32 reason)
        internal
        notNull(destination)
        returns (uint transactionId)
    {
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            reason: reason,
            executed: false
        });
        transactionCount += 1;
        emit Submission(transactionId);
    }



    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Number of confirmations.
    function getConfirmationCount(uint transactionId)
        public
        constant
        returns (uint count)
    {
        for (uint i=0; i<supervisors.length; i++){
            if (confirmations[transactionId][supervisors[i]]){
                count += 1;
            }
        }
    }

    /// @dev Returns total number of transactions after filers are applied.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Total number of transactions after filters are applied.
    function getTransactionCount(bool pending, bool executed)
        public
        constant
        returns (uint count)
    {
        for (uint i=0; i<transactionCount; i++)
            if (   pending && !transactions[i].executed
                || executed && transactions[i].executed)
                count += 1;
    }

    /// @dev Returns list of supervisors.
    /// @return List of supervisors addresses.
    function getSupervisors()
        public
        constant
        returns (address[])
    {
        return supervisors;
    }

    /*
     * @dev Return the executor
     * @return Executor address
     */
    function getExecutor()
        public
        constant
        returns (address)
    {
        return executor;
    }

    /// @dev Returns array with supervisors addresses, which confirmed transaction.
    /// @param transactionId Transaction ID.
    /// @return Returns array of supervisors addresses.
    function getConfirmations(uint transactionId)
        public
        constant
        returns (address[] _confirmations)
    {
        address[] memory confirmationsTemp = new address[](supervisors.length);
        uint count = 0;
        uint i;
        for (i=0; i<supervisors.length; i++)
            if (confirmations[transactionId][supervisors[i]]) {
                confirmationsTemp[count] = supervisors[i];
                count += 1;
            }
        _confirmations = new address[](count);
        for (i=0; i<count; i++)
            _confirmations[i] = confirmationsTemp[i];
    }

    /// @dev Returns list of transaction IDs in defined range.
    /// @param from Index start position of transaction array.
    /// @param to Index end position of transaction array.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Returns array of transaction IDs.
    function getTransactionIds(uint from, uint to, bool pending, bool executed)
        public
        constant
        returns (uint[] _transactionIds)
    {
        uint[] memory transactionIdsTemp = new uint[](transactionCount);
        uint count = 0;
        uint i;
        for (i=0; i<transactionCount; i++)
            if (   pending && !transactions[i].executed
                || executed && transactions[i].executed)
            {
                transactionIdsTemp[count] = i;
                count += 1;
            }
        _transactionIds = new uint[](to - from);
        for (i=from; i<to; i++)
            _transactionIds[i - from] = transactionIdsTemp[i];
    }
}
