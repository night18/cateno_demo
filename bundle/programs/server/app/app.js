var require = meteorInstall({"lib":{"router.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// lib/router.js                                                                                         //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Router.configure({
  layoutTemplate: 'layout'
});
Router.route('/', {
  name: 'login'
});
Router.route('/dashboardc', {
  name: 'company'
});
Router.route('/dashboardi', {
  name: 'investor'
});
Router.route('/request', {
  name: 'request'
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// server/main.js                                                                                        //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Web3;
module.watch(require("web3"), {
  default(v) {
    Web3 = v;
  }

}, 1);
let multisigDailyLimitABI;
module.watch(require("./contract/multiSigDailyLimit.json"), {
  default(v) {
    multisigDailyLimitABI = v;
  }

}, 2);
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.net.isListening().then(console.log);
Future = Npm.require('fibers/future');
var account0 = "0xdb5cd3393b2cadce79f4a01331a5f6023e971de0";
var account1 = "0x620eaefaaab0cc169ee1fa9f30c3efe4771cc22b";
Meteor.startup(() => {
  // code to run on server at startup
  Meteor.methods({
    'getEthAddress': function (name) {
      var fut = new Future();

      if (name == "company") {
        // fut.return({getEthAddress:web3.eth.coinbase});
        // return fut.wait();
        web3.eth.getCoinbase((err, cb) => {
          if (err) {
            fut.throw(err);
          } else {
            fut.return(cb);
          }
        });
        console.log("!!!");
        return fut.wait();
      } else if (name == "investor") {}
    },
    'deployWallet': function () {
      let _executor = account0;
      let _supervisors = account1;
      let _required = 1;

      let _dailyLimit = web3.utils.toWei("20", "ether");

      let multisigwalletwithdailylimitContract = new web3.eth.Contract(multisigDailyLimitABI.abi); // console.log(multisigDailyLimitABI.binHx);

      multisigwalletwithdailylimitContract.deploy({
        data: multisigDailyLimitABI.binHx,
        arguments: [_executor, _supervisors, _required, _dailyLimit]
      }).send({
        from: _executor,
        gas: 3000000,
        gasPrice: '300000000'
      }, function (error, HxTrans) {
        if (error) {
          console.error(error);
        } else {
          console.log("HxTrans: " + HxTrans);
        }
      }).on('error', function (error) {
        console.error(error);
      }).on('transactionHash', function (transactionHash) {
        console.log("transactionHash: " + transactionHash);
      }).on('receipt', function (receipt) {
        console.log("receipt: " + receipt.contractAddress); // contains the new contract address
      }).on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation No: ' + confirmationNumber + " " + receipt);
      }).then(function (newContractInstance) {
        console.log('!!');
        console.log(newContractInstance.options.address); // instance with the new contract address
      });
    },
    'submitTransaction': function (amount, receiver, reason) {
      var fut = new Future();
      var amountInWei = web3.utils.toWei(amount, "ether");
      var sender = account0;
      var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
      dailyWallet.methods.submitTransaction(receiver, amountInWei, web3.utils.asciiToHex(""), web3.utils.asciiToHex(reason)).send({
        from: sender,
        gas: 300000 //TODO

      }).on('error', function (error) {
        console.error(error);
      }).on('transactionHash', function (transactionHash) {
        console.log("transactionHash: " + transactionHash);
      }).on('receipt', function (receipt) {
        console.log("receipt: " + receipt.contractAddress); // contains the new contract address
      }).on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation No: ' + confirmationNumber + " " + receipt);
      }).then(function (transaction) {
        console.log("ID:");
        var transactionId = transaction.events.Submission.returnValues.transactionId;
        console.log(transactionId);
        fut.return(true);
      });
      return fut.wait();
    },
    'settingMilestone': function (amount, receiver, reason, milestone) {
      var fut = new Future();
      var amountInWei = web3.utils.toWei(amount, "ether");
      var sender = account0;
      var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
      console.log(Number(milestone));
      dailyWallet.methods.settingMilestone(receiver, amountInWei, web3.utils.asciiToHex(""), web3.utils.asciiToHex(reason), milestone).send({
        from: sender,
        gas: 450000 //TODO

      }).on('error', function (error) {
        console.error(error);
      }).on('transactionHash', function (transactionHash) {
        console.log("transactionHash: " + transactionHash);
      }).on('receipt', function (receipt) {
        console.log("receipt: " + receipt.contractAddress); // contains the new contract address
      }).on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation No: ' + confirmationNumber + " " + receipt);
      }).then(function (transaction) {
        console.log("ID:");
        var transactionId = transaction.events.Submission.returnValues.transactionId;
        console.log(transactionId);
        fut.return(true);
      });
      return fut.wait();
    },
    'updatePrice': function () {
      var fut = new Future();
      var sender = account0;
      var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
      console.log("!!!");
      console.log(sender);
      dailyWallet.methods.updatePrice().send({
        from: sender,
        gas: 140000,
        //TODO
        value: 500000
      }).on('error', function (error) {
        console.error(error);
      }).on('transactionHash', function (transactionHash) {
        console.log("transactionHash: " + transactionHash);
      }).on('receipt', function (receipt) {
        console.log("receipt: " + receipt.contractAddress); // contains the new contract address
      }).on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation No: ' + confirmationNumber + " " + receipt);
      }).then(function (transaction) {
        dailyWallet.methods.checkMilestone().send({
          from: sender,
          gas: 300000 //TODO

        }).on('error', function (error) {
          console.log("error");
          console.error(error);
          fut.throw(error);
        }).on('transactionHash', function (transactionHash) {
          console.log("transactionHash: " + transactionHash);
        }).on('receipt', function (receipt) {
          console.log("receipt: " + receipt.contractAddress); // contains the new contract address
        }).on('confirmation', function (confirmationNumber, receipt) {
          console.log('confirmation No: ' + confirmationNumber + " " + receipt);
        }).then(function (transaction) {
          console.log(transaction);
          fut.return(true);
        });
      });
      return fut.wait();
    },
    'requestWithOutLimit': function (amount, receiver, reason) {
      var fut = new Future();
      var amountInWei = web3.utils.toWei(amount, "ether");
      var sender = account0;
      var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
      dailyWallet.methods.submitTransaction(receiver, amountInWei, web3.utils.asciiToHex(""), web3.utils.asciiToHex(reason)).send({
        from: sender,
        gas: 140000 //TODO

      }).on('error', function (error) {
        console.error(error);
      }).on('transactionHash', function (transactionHash) {
        console.log("transactionHash: " + transactionHash);
      }).on('receipt', function (receipt) {
        console.log("receipt: " + receipt.contractAddress); // contains the new contract address
      }).on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation No: ' + confirmationNumber + " " + receipt);
      }).then(function (transaction) {
        console.log("ID:");
        var transactionId = transaction.events.Submission.returnValues.transactionId;
        console.log(transactionId);
        dailyWallet.methods.executeDailyTransaction(transactionId) //TODO
        .send({
          from: sender,
          gas: 140000 //TODO

        }).on('error', function (error) {
          console.log("error");
          console.error(error);
          fut.throw(error);
        }).on('transactionHash', function (transactionHash) {
          console.log("transactionHash: " + transactionHash);
        }).on('receipt', function (receipt) {
          console.log("receipt: " + receipt.contractAddress); // contains the new contract address
        }).on('confirmation', function (confirmationNumber, receipt) {
          console.log('confirmation No: ' + confirmationNumber + " " + receipt);
        }).then(function (transaction) {
          console.log(transaction);
          fut.return(true);
        });
      });
      return fut.wait();
    },
    'confirmTransaction': function (transactionId) {
      var fut = new Future();
      var sender = account1;
      var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
      dailyWallet.methods.confirmTransaction(transactionId).send({
        from: sender,
        gas: 140000 //TODO

      }).on('error', function (error) {
        console.error(error);
      }).on('transactionHash', function (transactionHash) {
        console.log("transactionHash: " + transactionHash);
      }).on('receipt', function (receipt) {
        console.log("receipt: " + receipt.contractAddress); // contains the new contract address
      }).on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation No: ' + confirmationNumber + " " + receipt);
      }).then(function (transaction) {
        fut.return(true);
      });
      return fut.wait();
    },
    'getTransNumber': function () {
      var fut = new Future();
      var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
      var sender = account0; // dailyWallet.methods.transactions

      dailyWallet.methods.getTransactionCount(true, true).call({
        from: sender
      }).then(function (trans_num) {
        console.log(trans_num);

        if (trans_num && trans_num != 0) {
          fut.return(trans_num);
        } else {
          fut.throw("No history found");
        }
      });
      return fut.wait();
    },
    'showHistory': function (trans_num) {
      var indexArray = [];
      var sender = account0;
      var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);

      for (var i = 0; i < trans_num; i++) {
        indexArray.push(i);
      }

      console.log("@@@@");
      console.log(multisigDailyLimitABI.address);

      var futs = _.map(indexArray, function (item, index) {
        var fut = new Future();
        var onComplete = fut.resolver();
        dailyWallet.methods.transactions(item).call({
          from: sender
        }, function (err, result) {
          if (err) {
            console.error(err);
          } else {
            // console.log(web3);
            result.reason = web3.utils.toAscii(result.reason).replace(/\0/g, '');
            console.log(result.reason);
            onComplete(err, result);
          }
        });
        return fut;
      });

      Future.wait(futs);
      return _.invoke(futs, 'get');
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"contract":{"multiSigDailyLimit.json":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// server/contract/multiSigDailyLimit.json                                                               //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
module.exports = {
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "getSupervisors",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "EURGBP",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "revokeConfirmation",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "myid",
          "type": "bytes32"
        },
        {
          "name": "result",
          "type": "string"
        }
      ],
      "name": "__callback",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_supervisor",
          "type": "address"
        }
      ],
      "name": "addSupervisor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "executeDailyTransaction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "destination",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "reason",
          "type": "bytes32"
        }
      ],
      "name": "submitTransaction",
      "outputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "myid",
          "type": "bytes32"
        },
        {
          "name": "result",
          "type": "string"
        },
        {
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "__callback",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "checkMilestone",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "milestone_target",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "calcMaxWithdraw",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "pending",
          "type": "bool"
        },
        {
          "name": "executed",
          "type": "bool"
        }
      ],
      "name": "getTransactionCount",
      "outputs": [
        {
          "name": "count",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "updatePrice",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "dailyLimit",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "lastDay",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getExecutor",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_supervisor",
          "type": "address"
        }
      ],
      "name": "removeSupervisor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "isConfirmed",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_supervisor",
          "type": "address"
        },
        {
          "name": "_newSupervisor",
          "type": "address"
        }
      ],
      "name": "replaceSupervisor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "getConfirmationCount",
      "outputs": [
        {
          "name": "count",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transactions",
      "outputs": [
        {
          "name": "destination",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "reason",
          "type": "bytes32"
        },
        {
          "name": "executed",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "from",
          "type": "uint256"
        },
        {
          "name": "to",
          "type": "uint256"
        },
        {
          "name": "pending",
          "type": "bool"
        },
        {
          "name": "executed",
          "type": "bool"
        }
      ],
      "name": "getTransactionIds",
      "outputs": [
        {
          "name": "_transactionIds",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "destination",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "reason",
          "type": "bytes32"
        },
        {
          "name": "target",
          "type": "uint256"
        }
      ],
      "name": "settingMilestone",
      "outputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "getConfirmations",
      "outputs": [
        {
          "name": "_confirmations",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_required",
          "type": "uint256"
        }
      ],
      "name": "changeRequirement",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "confirmTransaction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_dailyLimit",
          "type": "uint256"
        }
      ],
      "name": "changeDailyLimit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "executeTransaction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "spentToday",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_executor",
          "type": "address"
        },
        {
          "name": "_supervisors",
          "type": "address[]"
        },
        {
          "name": "_required",
          "type": "uint256"
        },
        {
          "name": "_dailyLimit",
          "type": "uint256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "dailyLimit",
          "type": "uint256"
        }
      ],
      "name": "DailyLimitChange",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "nextStep",
          "type": "string"
        }
      ],
      "name": "LogConstructorInitiated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "price",
          "type": "string"
        }
      ],
      "name": "LogPriceUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "description",
          "type": "string"
        }
      ],
      "name": "LogNewOraclizeQuery",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "Confirmation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "Revocation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "Submission",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "Execution",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "ExecutionFailure",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "supervisor",
          "type": "address"
        }
      ],
      "name": "SupervisorAddition",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "supervisor",
          "type": "address"
        }
      ],
      "name": "SupervisorRemoval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "required",
          "type": "uint256"
        }
      ],
      "name": "RequirementChange",
      "type": "event"
    }
  ],
  "binHx": "0x60606040526040516200449e3803806200449e8339810160405280805190602001909190805182019190602001805190602001909190805190602001909190505083838360008360008173ffffffffffffffffffffffffffffffffffffffff16141515156200006d57600080fd5b83518360328211158015620000825750818111155b801562000090575060008114155b80156200009e575060008214155b1515620000aa57600080fd5b600093505b8551841015620001e557600260008786815181101515620000cc57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161580156200015b5750600086858151811015156200013857fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1614155b15156200016757600080fd5b60016002600088878151811015156200017c57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508380600101945050620000af565b86600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555085600490805190602001906200023e92919062000367565b5084600581905550505050505050507f11a3fca63f87bd67d7f9f72b744acc8be2193705e7a734ac3a773d35d259e87b60405180806020018281038252604b8152602001807f436f6e7374727563746f722077617320696e697469617465642e2043616c6c2081526020017f27757064617465507269636528292720746f2073656e6420746865204f72616381526020017f6c697a652051756572792e00000000000000000000000000000000000000000081525060600191505060405180910390a17338840065dee586eb33a77390649af699dbf99f37600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600d81905550505050506200043c565b828054828255906000526020600020908101928215620003e3579160200282015b82811115620003e25782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509160200191906001019062000388565b5b509050620003f29190620003f6565b5090565b6200043991905b808211156200043557600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101620003fd565b5090565b90565b614052806200044c6000396000f300606060405260043610610175576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630ad0530b1461017757806315523a51146101e157806320ea8d861461020a57806327dc297e1461022d57806329d10b6e146102975780632d8cf660146102d057806338959e20146102f357806338bbfa501461039957806339a5050814610446578063455678591461045b5780634bc9fdc21461049257806354741525146104bb578063673a7e28146104ff57806367eeba0c146105095780636b0c932d146105325780636c1032af1461055b5780637128defb146105b0578063784547a7146105e95780637bceaf91146106245780638b51d13f1461067c5780639ace38c2146106b3578063a8abe69a146107a3578063b3e8f0291461083a578063b5dc40c3146108e9578063ba51a6df14610961578063c01a8c8414610984578063cea08621146109a7578063ee22610b146109ca578063f059cf2b146109ed575b005b341561018257600080fd5b61018a610a16565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156101cd5780820151818401526020810190506101b2565b505050509050019250505060405180910390f35b34156101ec57600080fd5b6101f4610aaa565b6040518082815260200191505060405180910390f35b341561021557600080fd5b61022b6004808035906020019091905050610ab0565b005b341561023857600080fd5b61029560048080356000191690602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610c58565b005b34156102a257600080fd5b6102ce600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610d48565b005b34156102db57600080fd5b6102f16004808035906020019091905050610f4a565b005b34156102fe57600080fd5b610383600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919080356000191690602001909190505061114f565b6040518082815260200191505060405180910390f35b34156103a457600080fd5b61044460048080356000191690602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506111c5565b005b341561045157600080fd5b6104596111ca565b005b341561046657600080fd5b61047c6004808035906020019091905050611249565b6040518082815260200191505060405180910390f35b341561049d57600080fd5b6104a5611261565b6040518082815260200191505060405180910390f35b34156104c657600080fd5b6104e960048080351515906020019091908035151590602001909190505061129e565b6040518082815260200191505060405180910390f35b610507611330565b005b341561051457600080fd5b61051c611572565b6040518082815260200191505060405180910390f35b341561053d57600080fd5b610545611578565b6040518082815260200191505060405180910390f35b341561056657600080fd5b61056e61157e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156105bb57600080fd5b6105e7600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506115a8565b005b34156105f457600080fd5b61060a6004808035906020019091905050611844565b604051808215151515815260200191505060405180910390f35b341561062f57600080fd5b61067a600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061192a565b005b341561068757600080fd5b61069d6004808035906020019091905050611c69565b6040518082815260200191505060405180910390f35b34156106be57600080fd5b6106d46004808035906020019091905050611d35565b604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185815260200180602001846000191660001916815260200183151515158152602001828103825285818151815260200191508051906020019080838360005b83811015610764578082015181840152602081019050610749565b50505050905090810190601f1680156107915780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34156107ae57600080fd5b6107e3600480803590602001909190803590602001909190803515159060200190919080351515906020019091905050611e30565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561082657808201518184015260208101905061080b565b505050509050019250505060405180910390f35b341561084557600080fd5b6108d3600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803560001916906020019091908035906020019091905050611f8c565b6040518082815260200191505060405180910390f35b34156108f457600080fd5b61090a6004808035906020019091905050612044565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561094d578082015181840152602081019050610932565b505050509050019250505060405180910390f35b341561096c57600080fd5b610982600480803590602001909190505061226e565b005b341561098f57600080fd5b6109a56004808035906020019091905050612328565b005b34156109b257600080fd5b6109c86004808035906020019091905050612505565b005b34156109d557600080fd5b6109eb6004808035906020019091905050612580565b005b34156109f857600080fd5b610a00612828565b6040518082815260200191505060405180910390f35b610a1e613e41565b6004805480602002602001604051908101604052809291908181526020018280548015610aa057602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610a56575b5050505050905090565b600c5481565b33600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610b0957600080fd5b81336001600083815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610b7457600080fd5b8360008082815260200190815260200160002060040160009054906101000a900460ff16151515610ba457600080fd5b60006001600087815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550843373ffffffffffffffffffffffffffffffffffffffff167ff6a317157440607f36269043eb55f1287a5a19ba2216afeab88cd46cbcfb88e960405160405180910390a35050505050565b610c6061282e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c9957600080fd5b610ca281612b21565b600c819055507f71f1a5645e51a2da828ffcf79cc17da88eb25e1bca8b9dced23210847a4769c1816040518080602001828103825283818151815260200191508051906020019080838360005b83811015610d0a578082015181840152602081019050610cef565b50505050905090810190601f168015610d375780820380516001836020036101000a031916815260200191505b509250505060405180910390a15050565b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d8257600080fd5b80600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151515610ddc57600080fd5b8160008173ffffffffffffffffffffffffffffffffffffffff1614151515610e0357600080fd5b60016004805490500160055460328211158015610e205750818111155b8015610e2d575060008114155b8015610e3a575060008214155b1515610e4557600080fd5b6001600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060048054806001018281610eb19190613e55565b9160005260206000209001600087909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550508473ffffffffffffffffffffffffffffffffffffffff167f1c0b189a6a50c7e5a9206b411bc2ad859b6f819fa17915c71cffc79a822451ff60405160405180910390a25050505050565b60008033600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515610faa57600080fd5b8360008082815260200190815260200160002060040160009054906101000a900460ff16151515610fda57600080fd5b6000808681526020019081526020016000209350610ff785611844565b9250828061100e575061100d8460010154612b35565b5b156111485760018460040160006101000a81548160ff02191690831515021790555082151561104c578360010154600f600082825401925050819055505b8360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc85600101549081150290604051600060405180830381858888f19350505050156110e057847f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed7560405160405180910390a2611147565b847f526441bb6c1aba3c9a4a6ca1d6545da9c2333c8c48343ef398eb858d72b7923660405160405180910390a260008460040160006101000a81548160ff021916908315150217905550821515611146578360010154600f600082825403925050819055505b5b5b5050505050565b600033600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415156111ae57600080fd5b6111ba86868686612b87565b915050949350505050565b505050565b60008090505b60108054905081101561124657601160006010838154811015156111f057fe5b906000526020600020900154815260200190815260200160002054600c541015156112395761123860108281548110151561122757fe5b906000526020600020900154612cf4565b5b80806001019150506111d0565b50565b60116020528060005260406000206000915090505481565b600062015180600e540142111561127c57600d54905061129b565b600f54600d541015611291576000905061129b565b600f54600d540390505b90565b600080600090505b600654811015611329578380156112dd575060008082815260200190815260200160002060040160009054906101000a900460ff16155b80611310575082801561130f575060008082815260200190815260200160002060040160009054906101000a900460ff165b5b1561131c576001820191505b80806001019150506112a6565b5092915050565b3073ffffffffffffffffffffffffffffffffffffffff16316113866040805190810160405280600381526020017f55524c0000000000000000000000000000000000000000000000000000000000815250612ddd565b1115611445577f621c2856e3b87f81235f8ac8a22bbb40a0142961960710d00b2b6c380902b57e60405180806020018281038252604b8152602001807f4f7261636c697a6520717565727920776173204e4f542073656e742c20706c6581526020017f6173652061646420736f6d652045544820746f20636f76657220666f7220746881526020017f652071756572792066656500000000000000000000000000000000000000000081525060600191505060405180910390a1611570565b7f621c2856e3b87f81235f8ac8a22bbb40a0142961960710d00b2b6c380902b57e6040518080602001828103825260358152602001807f4f7261636c697a65207175657279207761732073656e742c207374616e64696e81526020017f6720627920666f722074686520616e737765722e2e000000000000000000000081525060400191505060405180910390a161156e6040805190810160405280600381526020017f55524c0000000000000000000000000000000000000000000000000000000000815250606060405190810160405280602d81526020017f6a736f6e28687474703a2f2f35342e3135332e3132342e39343a333030322f6181526020017f70692f7171292e74617267657400000000000000000000000000000000000000815250613142565b505b565b600d5481565b600e5481565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60003073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115e457600080fd5b81600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561163d57600080fd5b6000600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600091505b6001600480549050038210156117c5578273ffffffffffffffffffffffffffffffffffffffff166004838154811015156116d057fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156117b857600460016004805490500381548110151561172f57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660048381548110151561176a57fe5b906000526020600020900160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506117c5565b818060010192505061169a565b60016004818180549050039150816117dd9190613e81565b5060048054905060055411156117fc576117fb60048054905061226e565b5b8273ffffffffffffffffffffffffffffffffffffffff167f5d85032c449d423f13d9cffa44997a2450d8a1cd699937cb67f4c838f1d9660860405160405180910390a2505050565b6000806000809150600090505b6004805490508110156119225760016000858152602001908152602001600020600060048381548110151561188257fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615611902576001820191505b6005548214156119155760019250611923565b8080600101915050611851565b5b5050919050565b60003073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561196657600080fd5b82600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156119bf57600080fd5b82600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151515611a1957600080fd5b8360008173ffffffffffffffffffffffffffffffffffffffff1614151515611a4057600080fd5b600093505b600480549050841015611b2b578573ffffffffffffffffffffffffffffffffffffffff16600485815481101515611a7857fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611b1e5784600485815481101515611ad057fe5b906000526020600020900160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611b2b565b8380600101945050611a45565b6000600260008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508573ffffffffffffffffffffffffffffffffffffffff167f5d85032c449d423f13d9cffa44997a2450d8a1cd699937cb67f4c838f1d9660860405160405180910390a28473ffffffffffffffffffffffffffffffffffffffff167f1c0b189a6a50c7e5a9206b411bc2ad859b6f819fa17915c71cffc79a822451ff60405160405180910390a2505050505050565b600080600090505b600480549050811015611d2f57600160008481526020019081526020016000206000600483815481101515611ca257fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615611d22576001820191505b8080600101915050611c71565b50919050565b60006020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001015490806002018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611e0d5780601f10611de257610100808354040283529160200191611e0d565b820191906000526020600020905b815481529060010190602001808311611df057829003601f168201915b5050505050908060030154908060040160009054906101000a900460ff16905085565b611e38613ead565b611e40613ead565b600080600654604051805910611e535750595b9080825280602002602001820160405250925060009150600090505b600654811015611f0f57858015611ea6575060008082815260200190815260200160002060040160009054906101000a900460ff16155b80611ed95750848015611ed8575060008082815260200190815260200160002060040160009054906101000a900460ff165b5b15611f0257808383815181101515611eed57fe5b90602001906020020181815250506001820191505b8080600101915050611e6f565b878703604051805910611f1f5750595b908082528060200260200182016040525093508790505b86811015611f81578281815181101515611f4c57fe5b9060200190602002015184898303815181101515611f6657fe5b90602001906020020181815250508080600101915050611f36565b505050949350505050565b600033600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515611feb57600080fd5b611ff78787878761114f565b91506010805480600101828161200d9190613ec1565b9160005260206000209001600084909190915055508260116000848152602001908152602001600020819055505095945050505050565b61204c613e41565b612054613e41565b60008060048054905060405180591061206a5750595b9080825280602002602001820160405250925060009150600090505b6004805490508110156121c9576001600086815260200190815260200160002060006004838154811015156120b757fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156121bc5760048181548110151561213f57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16838381518110151561217957fe5b9060200190602002019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506001820191505b8080600101915050612086565b816040518059106121d75750595b90808252806020026020018201604052509350600090505b8181101561226657828181518110151561220557fe5b90602001906020020151848281518110151561221d57fe5b9060200190602002019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505080806001019150506121ef565b505050919050565b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156122a857600080fd5b60048054905081603282111580156122c05750818111155b80156122cd575060008114155b80156122da575060008214155b15156122e557600080fd5b826005819055507fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a836040518082815260200191505060405180910390a1505050565b33600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561238157600080fd5b81600080600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515156123dd57600080fd5b82336001600083815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151561244957600080fd5b600180600087815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550843373ffffffffffffffffffffffffffffffffffffffff167f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef60405160405180910390a36124fe85612580565b5050505050565b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561253f57600080fd5b80600d819055507fc71bdc6afaf9b1aa90a7078191d4fc1adf3bf680fca3183697df6b0dc226bca2816040518082815260200191505060405180910390a150565b600033600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156125db57600080fd5b82336001600083815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561264657600080fd5b8460008082815260200190815260200160002060040160009054906101000a900460ff1615151561267657600080fd5b61267f86611844565b1561282057600080878152602001908152602001600020945060018560040160006101000a81548160ff02191690831515021790555061279d8560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16866001015487600201805460018160011615610100020316600290049050886002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156127935780601f1061276857610100808354040283529160200191612793565b820191906000526020600020905b81548152906001019060200180831161277657829003601f168201915b5050505050613654565b156127d457857f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed7560405160405180910390a261281f565b857f526441bb6c1aba3c9a4a6ca1d6545da9c2333c8c48343ef398eb858d72b7923660405160405180910390a260008560040160006101000a81548160ff0219169083151502179055505b5b505050505050565b600f5481565b600080600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614806128a05750600061289e600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661367b565b145b156128b1576128af6000613686565b505b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338cc48316040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b151561293657600080fd5b5af1151561294357600080fd5b5050506040518051905073ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515612a8057600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338cc48316040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515612a2857600080fd5b5af11515612a3557600080fd5b50505060405180519050600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c281d19e6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515612b0557600080fd5b5af11515612b1257600080fd5b50505060405180519050905090565b6000612b2e826000613697565b9050919050565b600062015180600e5401421115612b565742600e819055506000600f819055505b600d5482600f54011180612b6f5750600f5482600f5401105b15612b7d5760009050612b82565b600190505b919050565b60008460008173ffffffffffffffffffffffffffffffffffffffff1614151515612bb057600080fd5b600654915060a0604051908101604052808773ffffffffffffffffffffffffffffffffffffffff168152602001868152602001858152602001846000191681526020016000151581525060008084815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550602082015181600101556040820151816002019080519060200190612c79929190613eed565b506060820151816003019060001916905560808201518160040160006101000a81548160ff0219169083151502179055509050506001600660008282540192505081905550817fc0ba8fe4b176c1714197d43b9cc6bcf797a4a7461c5fe8d0ef6e184ae7601e5160405160405180910390a250949350505050565b6000806000838152602001908152602001600020905060018160040160006101000a81548160ff0219169083151502179055508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc82600101549081150290604051600060405180830381858888f1935050505015612dbb57817f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed7560405160405180910390a2612dd9565b60008160040160006101000a81548160ff0219169083151502179055505b5050565b600080600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161480612e4f57506000612e4d600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661367b565b145b15612e6057612e5e6000613686565b505b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338cc48316040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515612ee557600080fd5b5af11515612ef257600080fd5b5050506040518051905073ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561302f57600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338cc48316040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515612fd757600080fd5b5af11515612fe457600080fd5b50505060405180519050600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663524f3889836040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001828103825283818151815260200191508051906020019080838360005b838110156130d95780820151818401526020810190506130be565b50505050905090810190601f1680156131065780820380516001836020036101000a031916815260200191505b5092505050602060405180830381600087803b151561312457600080fd5b5af1151561313157600080fd5b505050604051805190509050919050565b6000806000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614806131b6575060006131b4600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661367b565b145b156131c7576131c56000613686565b505b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338cc48316040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b151561324c57600080fd5b5af1151561325957600080fd5b5050506040518051905073ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561339657600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338cc48316040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b151561333e57600080fd5b5af1151561334b57600080fd5b50505060405180519050600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663524f3889856040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001828103825283818151815260200191508051906020019080838360005b83811015613440578082015181840152602081019050613425565b50505050905090810190601f16801561346d5780820380516001836020036101000a031916815260200191505b5092505050602060405180830381600087803b151561348b57600080fd5b5af1151561349857600080fd5b50505060405180519050905062030d403a02670de0b6b3a7640000018111156134c7576000600102915061364d565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663adf59f9982600087876040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808481526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561357f578082015181840152602081019050613564565b50505050905090810190601f1680156135ac5780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156135e55780820151818401526020810190506135ca565b50505050905090810190601f1680156136125780820380516001836020036101000a031916815260200191505b50955050505050506020604051808303818588803b151561363257600080fd5b5af1151561363f57600080fd5b505050506040518051905091505b5092915050565b6000806040516020840160008287838a8c6187965a03f19250505080915050949350505050565b6000813b9050919050565b6000613690613991565b9050919050565b60006136a1613f6d565b60008060008693506000925060009150600090505b83518110156139725760307f01000000000000000000000000000000000000000000000000000000000000000284828151811015156136f157fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191610158015613809575060397f010000000000000000000000000000000000000000000000000000000000000002848281518110151561379957fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191611155b156138ba57811561382c57600086141561382257613972565b8580600190039650505b600a830292506030848281518110151561384257fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090040383019250613965565b602e7f01000000000000000000000000000000000000000000000000000000000000000284828151811015156138ec57fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916141561396457600191505b5b80806001019150506136b6565b60008611156139845785600a0a830292505b8294505050505092915050565b6000806139b1731d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed61367b565b1115613a5357731d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550613a4a6040805190810160405280600b81526020017f6574685f6d61696e6e6574000000000000000000000000000000000000000000815250613e27565b60019050613e24565b6000613a7273c03a2615d5efaf5f49f60b7bb6583eaec212fdf161367b565b1115613b145773c03a2615d5efaf5f49f60b7bb6583eaec212fdf1600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550613b0b6040805190810160405280600c81526020017f6574685f726f707374656e330000000000000000000000000000000000000000815250613e27565b60019050613e24565b6000613b3373b7a07bcf2ba2f2703b24c0691b5278999c59ac7e61367b565b1115613bd55773b7a07bcf2ba2f2703b24c0691b5278999c59ac7e600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550613bcc6040805190810160405280600981526020017f6574685f6b6f76616e0000000000000000000000000000000000000000000000815250613e27565b60019050613e24565b6000613bf473146500cfd35b22e4a392fe0adc06de1a1368ed4861367b565b1115613c965773146500cfd35b22e4a392fe0adc06de1a1368ed48600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550613c8d6040805190810160405280600b81526020017f6574685f72696e6b656279000000000000000000000000000000000000000000815250613e27565b60019050613e24565b6000613cb5736f485c8bf6fc43ea212e93bbf8ce046c7f1cb47561367b565b1115613d1957736f485c8bf6fc43ea212e93bbf8ce046c7f1cb475600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060019050613e24565b6000613d387320e12a1f859b3feae5fb2a0a32c18f5a65555bbf61367b565b1115613d9c577320e12a1f859b3feae5fb2a0a32c18f5a65555bbf600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060019050613e24565b6000613dbb7351efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa61367b565b1115613e1f577351efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060019050613e24565b600090505b90565b8060099080519060200190613e3d929190613f81565b5050565b602060405190810160405280600081525090565b815481835581811511613e7c57818360005260206000209182019101613e7b9190614001565b5b505050565b815481835581811511613ea857818360005260206000209182019101613ea79190614001565b5b505050565b602060405190810160405280600081525090565b815481835581811511613ee857818360005260206000209182019101613ee79190614001565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10613f2e57805160ff1916838001178555613f5c565b82800160010185558215613f5c579182015b82811115613f5b578251825591602001919060010190613f40565b5b509050613f699190614001565b5090565b602060405190810160405280600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10613fc257805160ff1916838001178555613ff0565b82800160010185558215613ff0579182015b82811115613fef578251825591602001919060010190613fd4565b5b509050613ffd9190614001565b5090565b61402391905b8082111561401f576000816000905550600101614007565b5090565b905600a165627a7a723058204f563ddfec4196c304b349e4c7e5b058224579a65ad67cf3263bcc003ca736020029",
  "address": "0x6946f675a669141eca3757abe5c3adcab274539a"
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("/lib/router.js");
require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvbGliL3JvdXRlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21haW4uanMiXSwibmFtZXMiOlsiUm91dGVyIiwiY29uZmlndXJlIiwibGF5b3V0VGVtcGxhdGUiLCJyb3V0ZSIsIm5hbWUiLCJNZXRlb3IiLCJtb2R1bGUiLCJ3YXRjaCIsInJlcXVpcmUiLCJ2IiwiV2ViMyIsImRlZmF1bHQiLCJtdWx0aXNpZ0RhaWx5TGltaXRBQkkiLCJ3ZWIzIiwicHJvdmlkZXJzIiwiSHR0cFByb3ZpZGVyIiwiZXRoIiwibmV0IiwiaXNMaXN0ZW5pbmciLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsIkZ1dHVyZSIsIk5wbSIsImFjY291bnQwIiwiYWNjb3VudDEiLCJzdGFydHVwIiwibWV0aG9kcyIsImZ1dCIsImdldENvaW5iYXNlIiwiZXJyIiwiY2IiLCJ0aHJvdyIsInJldHVybiIsIndhaXQiLCJfZXhlY3V0b3IiLCJfc3VwZXJ2aXNvcnMiLCJfcmVxdWlyZWQiLCJfZGFpbHlMaW1pdCIsInV0aWxzIiwidG9XZWkiLCJtdWx0aXNpZ3dhbGxldHdpdGhkYWlseWxpbWl0Q29udHJhY3QiLCJDb250cmFjdCIsImFiaSIsImRlcGxveSIsImRhdGEiLCJiaW5IeCIsImFyZ3VtZW50cyIsInNlbmQiLCJmcm9tIiwiZ2FzIiwiZ2FzUHJpY2UiLCJlcnJvciIsIkh4VHJhbnMiLCJvbiIsInRyYW5zYWN0aW9uSGFzaCIsInJlY2VpcHQiLCJjb250cmFjdEFkZHJlc3MiLCJjb25maXJtYXRpb25OdW1iZXIiLCJuZXdDb250cmFjdEluc3RhbmNlIiwib3B0aW9ucyIsImFkZHJlc3MiLCJhbW91bnQiLCJyZWNlaXZlciIsInJlYXNvbiIsImFtb3VudEluV2VpIiwic2VuZGVyIiwiZGFpbHlXYWxsZXQiLCJzdWJtaXRUcmFuc2FjdGlvbiIsImFzY2lpVG9IZXgiLCJ0cmFuc2FjdGlvbiIsInRyYW5zYWN0aW9uSWQiLCJldmVudHMiLCJTdWJtaXNzaW9uIiwicmV0dXJuVmFsdWVzIiwibWlsZXN0b25lIiwiTnVtYmVyIiwic2V0dGluZ01pbGVzdG9uZSIsInVwZGF0ZVByaWNlIiwidmFsdWUiLCJjaGVja01pbGVzdG9uZSIsImV4ZWN1dGVEYWlseVRyYW5zYWN0aW9uIiwiY29uZmlybVRyYW5zYWN0aW9uIiwiZ2V0VHJhbnNhY3Rpb25Db3VudCIsImNhbGwiLCJ0cmFuc19udW0iLCJpbmRleEFycmF5IiwiaSIsInB1c2giLCJmdXRzIiwiXyIsIm1hcCIsIml0ZW0iLCJpbmRleCIsIm9uQ29tcGxldGUiLCJyZXNvbHZlciIsInRyYW5zYWN0aW9ucyIsInJlc3VsdCIsInRvQXNjaWkiLCJyZXBsYWNlIiwiaW52b2tlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPQyxTQUFQLENBQWlCO0FBQ2ZDLGtCQUFnQjtBQURELENBQWpCO0FBSUFGLE9BQU9HLEtBQVAsQ0FBYSxHQUFiLEVBQWtCO0FBQUNDLFFBQU07QUFBUCxDQUFsQjtBQUNBSixPQUFPRyxLQUFQLENBQWEsYUFBYixFQUE0QjtBQUFDQyxRQUFNO0FBQVAsQ0FBNUI7QUFDQUosT0FBT0csS0FBUCxDQUFhLGFBQWIsRUFBNEI7QUFBQ0MsUUFBTTtBQUFQLENBQTVCO0FBQ0FKLE9BQU9HLEtBQVAsQ0FBYSxVQUFiLEVBQXlCO0FBQUNDLFFBQU07QUFBUCxDQUF6QixFOzs7Ozs7Ozs7OztBQ1BBLElBQUlDLE1BQUo7QUFBV0MsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDSCxTQUFPSSxDQUFQLEVBQVM7QUFBQ0osYUFBT0ksQ0FBUDtBQUFTOztBQUFwQixDQUF0QyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJQyxJQUFKO0FBQVNKLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxNQUFSLENBQWIsRUFBNkI7QUFBQ0csVUFBUUYsQ0FBUixFQUFVO0FBQUNDLFdBQUtELENBQUw7QUFBTzs7QUFBbkIsQ0FBN0IsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUcscUJBQUo7QUFB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O0FBQ0EsV0FGRCxNQUVLO0FBQ0o7QUFDQW1FLG1CQUFPakMsTUFBUCxHQUFnQm5ELEtBQUswQixLQUFMLENBQVcyRCxPQUFYLENBQW1CRCxPQUFPakMsTUFBMUIsRUFBa0NtQyxPQUFsQyxDQUEwQyxLQUExQyxFQUFpRCxFQUFqRCxDQUFoQjtBQUNBL0Usb0JBQVFDLEdBQVIsQ0FBWTRFLE9BQU9qQyxNQUFuQjtBQUNBOEIsdUJBQVdoRSxHQUFYLEVBQWdCbUUsTUFBaEI7QUFDQTtBQUNELFNBVEQ7QUFVQSxlQUFPckUsR0FBUDtBQUNBLE9BZlUsQ0FBWDs7QUFpQkFOLGFBQU9ZLElBQVAsQ0FBWXVELElBQVo7QUFDQSxhQUFPQyxFQUFFVSxNQUFGLENBQVNYLElBQVQsRUFBZSxLQUFmLENBQVA7QUFDQTtBQXRRYSxHQUFmO0FBd1FBLENBM1FELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlJvdXRlci5jb25maWd1cmUoe1xuICBsYXlvdXRUZW1wbGF0ZTogJ2xheW91dCdcbn0pO1xuXG5Sb3V0ZXIucm91dGUoJy8nLCB7bmFtZTogJ2xvZ2luJ30pO1xuUm91dGVyLnJvdXRlKCcvZGFzaGJvYXJkYycsIHtuYW1lOiAnY29tcGFueSd9KTtcblJvdXRlci5yb3V0ZSgnL2Rhc2hib2FyZGknLCB7bmFtZTogJ2ludmVzdG9yJ30pO1xuUm91dGVyLnJvdXRlKCcvcmVxdWVzdCcsIHtuYW1lOiAncmVxdWVzdCd9KTsiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBXZWIzIGZyb20gJ3dlYjMnO1xuaW1wb3J0IG11bHRpc2lnRGFpbHlMaW1pdEFCSSBmcm9tICcuL2NvbnRyYWN0L211bHRpU2lnRGFpbHlMaW1pdC5qc29uJztcblxubGV0IHdlYjMgPSBuZXcgV2ViMyhuZXcgV2ViMy5wcm92aWRlcnMuSHR0cFByb3ZpZGVyKFwiaHR0cDovL2xvY2FsaG9zdDo4NTQ1XCIpKTtcbndlYjMuZXRoLm5ldC5pc0xpc3RlbmluZygpLnRoZW4oY29uc29sZS5sb2cpO1xuRnV0dXJlID0gTnBtLnJlcXVpcmUoJ2ZpYmVycy9mdXR1cmUnKVxuXG52YXIgYWNjb3VudDAgPSBcIjB4ZGI1Y2QzMzkzYjJjYWRjZTc5ZjRhMDEzMzFhNWY2MDIzZTk3MWRlMFwiO1xudmFyIGFjY291bnQxID0gXCIweDYyMGVhZWZhYWFiMGNjMTY5ZWUxZmE5ZjMwYzNlZmU0NzcxY2MyMmJcIjtcblxuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIC8vIGNvZGUgdG8gcnVuIG9uIHNlcnZlciBhdCBzdGFydHVwXG5cblx0TWV0ZW9yLm1ldGhvZHMoe1xuXHRcdCdnZXRFdGhBZGRyZXNzJzogZnVuY3Rpb24obmFtZSl7XG5cbiAgXHRcdFx0dmFyIGZ1dCA9IG5ldyBGdXR1cmUoKTtcblx0XHRcdGlmKG5hbWUgPT0gXCJjb21wYW55XCIpe1xuXHRcdFx0XHQvLyBmdXQucmV0dXJuKHtnZXRFdGhBZGRyZXNzOndlYjMuZXRoLmNvaW5iYXNlfSk7XG4gICAgIFx0XHRcdC8vIHJldHVybiBmdXQud2FpdCgpO1xuICAgICBcdFx0XHR3ZWIzLmV0aC5nZXRDb2luYmFzZSgoZXJyLCBjYikgPT57XG4gICAgIFx0XHRcdFx0aWYoZXJyKXtcbiAgICAgXHRcdFx0XHRcdGZ1dC50aHJvdyhlcnIpO1xuICAgICBcdFx0XHRcdH1lbHNlIHtcbiAgICAgXHRcdFx0XHRcdGZ1dC5yZXR1cm4oY2IpO1xuICAgICBcdFx0XHRcdH1cbiAgICAgXHRcdFx0fSk7XG4gICAgIFx0XHRcdGNvbnNvbGUubG9nKFwiISEhXCIpO1xuICAgICBcdFx0XHRyZXR1cm4gZnV0LndhaXQoKTtcblx0XHRcdH1lbHNlIGlmKG5hbWUgPT0gXCJpbnZlc3RvclwiKXtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0J2RlcGxveVdhbGxldCc6ZnVuY3Rpb24oKXtcblx0XHRcdGxldCBfZXhlY3V0b3IgPSBhY2NvdW50MDtcblx0XHRcdGxldCBfc3VwZXJ2aXNvcnMgPSBhY2NvdW50MTtcblx0XHRcdGxldCBfcmVxdWlyZWQgPSAxO1xuXHRcdFx0bGV0IF9kYWlseUxpbWl0ID0gd2ViMy51dGlscy50b1dlaShcIjIwXCIsIFwiZXRoZXJcIik7XG4gXHRcdFx0bGV0IG11bHRpc2lnd2FsbGV0d2l0aGRhaWx5bGltaXRDb250cmFjdCA9IG5ldyB3ZWIzLmV0aC5Db250cmFjdChtdWx0aXNpZ0RhaWx5TGltaXRBQkkuYWJpKTtcbiBcdFx0XHQvLyBjb25zb2xlLmxvZyhtdWx0aXNpZ0RhaWx5TGltaXRBQkkuYmluSHgpO1xuIFx0XHRcdG11bHRpc2lnd2FsbGV0d2l0aGRhaWx5bGltaXRDb250cmFjdC5kZXBsb3koe1xuIFx0XHRcdFx0ZGF0YTogbXVsdGlzaWdEYWlseUxpbWl0QUJJLmJpbkh4LFxuIFx0XHRcdFx0YXJndW1lbnRzOiBbX2V4ZWN1dG9yLCBfc3VwZXJ2aXNvcnMsIF9yZXF1aXJlZCwgX2RhaWx5TGltaXRdXG4gXHRcdFx0fSlcblx0XHRcdC5zZW5kKHtcblx0XHRcdFx0ZnJvbTogX2V4ZWN1dG9yLFxuXHRcdFx0XHRnYXM6IDMwMDAwMDAsXG4gICBcdFx0XHRcdGdhc1ByaWNlOiAnMzAwMDAwMDAwJ1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3IsIEh4VHJhbnMpe1xuXHRcdFx0XHRpZihlcnJvcil7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRcdH1lbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkh4VHJhbnM6IFwiKyBIeFRyYW5zKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcil7IGNvbnNvbGUuZXJyb3IoZXJyb3IpOyB9KVxuXHRcdFx0Lm9uKCd0cmFuc2FjdGlvbkhhc2gnLCBmdW5jdGlvbih0cmFuc2FjdGlvbkhhc2gpeyBjb25zb2xlLmxvZyhcInRyYW5zYWN0aW9uSGFzaDogXCIgKyB0cmFuc2FjdGlvbkhhc2gpOyB9KVxuXHRcdFx0Lm9uKCdyZWNlaXB0JywgZnVuY3Rpb24ocmVjZWlwdCl7XG5cdFx0XHQgICBjb25zb2xlLmxvZyhcInJlY2VpcHQ6IFwiKyByZWNlaXB0LmNvbnRyYWN0QWRkcmVzcykgLy8gY29udGFpbnMgdGhlIG5ldyBjb250cmFjdCBhZGRyZXNzXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdjb25maXJtYXRpb24nLCBmdW5jdGlvbihjb25maXJtYXRpb25OdW1iZXIsIHJlY2VpcHQpeyBjb25zb2xlLmxvZygnY29uZmlybWF0aW9uIE5vOiAnKyBjb25maXJtYXRpb25OdW1iZXIrIFwiIFwiKyByZWNlaXB0KSB9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24obmV3Q29udHJhY3RJbnN0YW5jZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCchIScpO1xuXHRcdFx0ICAgIGNvbnNvbGUubG9nKG5ld0NvbnRyYWN0SW5zdGFuY2Uub3B0aW9ucy5hZGRyZXNzKSAvLyBpbnN0YW5jZSB3aXRoIHRoZSBuZXcgY29udHJhY3QgYWRkcmVzc1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzdWJtaXRUcmFuc2FjdGlvbic6IGZ1bmN0aW9uKGFtb3VudCwgcmVjZWl2ZXIsIHJlYXNvbiApe1xuXHRcdFx0dmFyIGZ1dCA9IG5ldyBGdXR1cmUoKTtcblx0XHRcdHZhciBhbW91bnRJbldlaSA9IHdlYjMudXRpbHMudG9XZWkoYW1vdW50LCBcImV0aGVyXCIpO1xuXHRcdFx0dmFyIHNlbmRlciA9IGFjY291bnQwO1xuXHRcdFx0dmFyIGRhaWx5V2FsbGV0ID0gbmV3IHdlYjMuZXRoLkNvbnRyYWN0KG11bHRpc2lnRGFpbHlMaW1pdEFCSS5hYmksIG11bHRpc2lnRGFpbHlMaW1pdEFCSS5hZGRyZXNzKTtcblxuXHRcdFx0ZGFpbHlXYWxsZXQubWV0aG9kcy5zdWJtaXRUcmFuc2FjdGlvbihyZWNlaXZlciwgYW1vdW50SW5XZWksIHdlYjMudXRpbHMuYXNjaWlUb0hleChcIlwiKSwgd2ViMy51dGlscy5hc2NpaVRvSGV4KHJlYXNvbikpXG5cdFx0XHQuc2VuZCh7XG5cdFx0XHRcdGZyb206IHNlbmRlcixcblx0XHRcdFx0Z2FzOiAzMDAwMDAgLy9UT0RPXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXsgY29uc29sZS5lcnJvcihlcnJvcik7IH0pXG5cdFx0XHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIGZ1bmN0aW9uKHRyYW5zYWN0aW9uSGFzaCl7IGNvbnNvbGUubG9nKFwidHJhbnNhY3Rpb25IYXNoOiBcIiArIHRyYW5zYWN0aW9uSGFzaCk7IH0pXG5cdFx0XHQub24oJ3JlY2VpcHQnLCBmdW5jdGlvbihyZWNlaXB0KXtcblx0XHRcdCAgIGNvbnNvbGUubG9nKFwicmVjZWlwdDogXCIrIHJlY2VpcHQuY29udHJhY3RBZGRyZXNzKSAvLyBjb250YWlucyB0aGUgbmV3IGNvbnRyYWN0IGFkZHJlc3Ncblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbmZpcm1hdGlvbicsIGZ1bmN0aW9uKGNvbmZpcm1hdGlvbk51bWJlciwgcmVjZWlwdCl7IGNvbnNvbGUubG9nKCdjb25maXJtYXRpb24gTm86ICcrIGNvbmZpcm1hdGlvbk51bWJlcisgXCIgXCIrIHJlY2VpcHQpIH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbih0cmFuc2FjdGlvbil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiSUQ6XCIpO1xuXHRcdFx0XHR2YXIgdHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmV2ZW50cy5TdWJtaXNzaW9uLnJldHVyblZhbHVlcy50cmFuc2FjdGlvbklkO1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0cmFuc2FjdGlvbklkKTtcblx0XHRcdFx0ZnV0LnJldHVybih0cnVlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gZnV0LndhaXQoKTtcblx0XHR9LFxuXG5cdFx0J3NldHRpbmdNaWxlc3RvbmUnOiBmdW5jdGlvbihhbW91bnQsIHJlY2VpdmVyLCByZWFzb24sIG1pbGVzdG9uZSl7XG5cdFx0XHR2YXIgZnV0ID0gbmV3IEZ1dHVyZSgpO1xuXHRcdFx0dmFyIGFtb3VudEluV2VpID0gd2ViMy51dGlscy50b1dlaShhbW91bnQsIFwiZXRoZXJcIik7XG5cdFx0XHR2YXIgc2VuZGVyID0gYWNjb3VudDA7XG5cdFx0XHR2YXIgZGFpbHlXYWxsZXQgPSBuZXcgd2ViMy5ldGguQ29udHJhY3QobXVsdGlzaWdEYWlseUxpbWl0QUJJLmFiaSwgbXVsdGlzaWdEYWlseUxpbWl0QUJJLmFkZHJlc3MpO1xuXHRcdFx0Y29uc29sZS5sb2coTnVtYmVyKG1pbGVzdG9uZSkpXG5cblx0XHRcdGRhaWx5V2FsbGV0Lm1ldGhvZHMuc2V0dGluZ01pbGVzdG9uZShyZWNlaXZlciwgYW1vdW50SW5XZWksIHdlYjMudXRpbHMuYXNjaWlUb0hleChcIlwiKSwgd2ViMy51dGlscy5hc2NpaVRvSGV4KHJlYXNvbiksIG1pbGVzdG9uZSlcblx0XHRcdC5zZW5kKHtcblx0XHRcdFx0ZnJvbTogc2VuZGVyLFxuXHRcdFx0XHRnYXM6IDQ1MDAwMCAvL1RPRE9cblx0XHRcdH0pXG5cdFx0XHQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IpeyBjb25zb2xlLmVycm9yKGVycm9yKTsgfSlcblx0XHRcdC5vbigndHJhbnNhY3Rpb25IYXNoJywgZnVuY3Rpb24odHJhbnNhY3Rpb25IYXNoKXsgY29uc29sZS5sb2coXCJ0cmFuc2FjdGlvbkhhc2g6IFwiICsgdHJhbnNhY3Rpb25IYXNoKTsgfSlcblx0XHRcdC5vbigncmVjZWlwdCcsIGZ1bmN0aW9uKHJlY2VpcHQpe1xuXHRcdFx0ICAgY29uc29sZS5sb2coXCJyZWNlaXB0OiBcIisgcmVjZWlwdC5jb250cmFjdEFkZHJlc3MpIC8vIGNvbnRhaW5zIHRoZSBuZXcgY29udHJhY3QgYWRkcmVzc1xuXHRcdFx0fSlcblx0XHRcdC5vbignY29uZmlybWF0aW9uJywgZnVuY3Rpb24oY29uZmlybWF0aW9uTnVtYmVyLCByZWNlaXB0KXsgY29uc29sZS5sb2coJ2NvbmZpcm1hdGlvbiBObzogJysgY29uZmlybWF0aW9uTnVtYmVyKyBcIiBcIisgcmVjZWlwdCkgfSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHRyYW5zYWN0aW9uKXtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJJRDpcIik7XG5cdFx0XHRcdHZhciB0cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uZXZlbnRzLlN1Ym1pc3Npb24ucmV0dXJuVmFsdWVzLnRyYW5zYWN0aW9uSWQ7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRyYW5zYWN0aW9uSWQpO1xuXHRcdFx0XHRmdXQucmV0dXJuKHRydWUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBmdXQud2FpdCgpO1xuXHRcdH0sXG5cblx0XHQndXBkYXRlUHJpY2UnOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGZ1dCA9IG5ldyBGdXR1cmUoKTtcblx0XHRcdHZhciBzZW5kZXIgPSBhY2NvdW50MDtcblx0XHRcdHZhciBkYWlseVdhbGxldCA9IG5ldyB3ZWIzLmV0aC5Db250cmFjdChtdWx0aXNpZ0RhaWx5TGltaXRBQkkuYWJpLCBtdWx0aXNpZ0RhaWx5TGltaXRBQkkuYWRkcmVzcyk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiEhIVwiKTtcblx0XHRcdGNvbnNvbGUubG9nKHNlbmRlcik7XG5cdFx0XHRkYWlseVdhbGxldC5tZXRob2RzLnVwZGF0ZVByaWNlKClcblx0XHRcdC5zZW5kKHtcblx0XHRcdFx0ZnJvbTogc2VuZGVyLFxuXHRcdFx0XHRnYXM6IDE0MDAwMCwgLy9UT0RPXG5cdFx0XHRcdHZhbHVlOiA1MDAwMDAsXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXsgY29uc29sZS5lcnJvcihlcnJvcik7IH0pXG5cdFx0XHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIGZ1bmN0aW9uKHRyYW5zYWN0aW9uSGFzaCl7IGNvbnNvbGUubG9nKFwidHJhbnNhY3Rpb25IYXNoOiBcIiArIHRyYW5zYWN0aW9uSGFzaCk7IH0pXG5cdFx0XHQub24oJ3JlY2VpcHQnLCBmdW5jdGlvbihyZWNlaXB0KXtcblx0XHRcdCAgIGNvbnNvbGUubG9nKFwicmVjZWlwdDogXCIrIHJlY2VpcHQuY29udHJhY3RBZGRyZXNzKSAvLyBjb250YWlucyB0aGUgbmV3IGNvbnRyYWN0IGFkZHJlc3Ncblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbmZpcm1hdGlvbicsIGZ1bmN0aW9uKGNvbmZpcm1hdGlvbk51bWJlciwgcmVjZWlwdCl7IGNvbnNvbGUubG9nKCdjb25maXJtYXRpb24gTm86ICcrIGNvbmZpcm1hdGlvbk51bWJlcisgXCIgXCIrIHJlY2VpcHQpIH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbih0cmFuc2FjdGlvbil7XG5cdFx0XHRcdGRhaWx5V2FsbGV0Lm1ldGhvZHMuY2hlY2tNaWxlc3RvbmUoKVxuXHRcdFx0XHQuc2VuZCh7XG5cdFx0XHRcdFx0ZnJvbTogc2VuZGVyLFxuXHRcdFx0XHRcdGdhczogMzAwMDAwIC8vVE9ET1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3Ipe2NvbnNvbGUubG9nKFwiZXJyb3JcIik7IGNvbnNvbGUuZXJyb3IoZXJyb3IpOyBmdXQudGhyb3coZXJyb3IpO30pXG5cdFx0XHRcdC5vbigndHJhbnNhY3Rpb25IYXNoJywgZnVuY3Rpb24odHJhbnNhY3Rpb25IYXNoKXsgY29uc29sZS5sb2coXCJ0cmFuc2FjdGlvbkhhc2g6IFwiICsgdHJhbnNhY3Rpb25IYXNoKTsgfSlcblx0XHRcdFx0Lm9uKCdyZWNlaXB0JywgZnVuY3Rpb24ocmVjZWlwdCl7XG5cdFx0XHRcdCAgIGNvbnNvbGUubG9nKFwicmVjZWlwdDogXCIrIHJlY2VpcHQuY29udHJhY3RBZGRyZXNzKSAvLyBjb250YWlucyB0aGUgbmV3IGNvbnRyYWN0IGFkZHJlc3Ncblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdjb25maXJtYXRpb24nLCBmdW5jdGlvbihjb25maXJtYXRpb25OdW1iZXIsIHJlY2VpcHQpeyBjb25zb2xlLmxvZygnY29uZmlybWF0aW9uIE5vOiAnKyBjb25maXJtYXRpb25OdW1iZXIrIFwiIFwiKyByZWNlaXB0KSB9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbih0cmFuc2FjdGlvbil7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2codHJhbnNhY3Rpb24pO1xuXHRcdFx0XHRcdGZ1dC5yZXR1cm4odHJ1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBmdXQud2FpdCgpO1xuXHRcdH0sXG5cblx0XHQncmVxdWVzdFdpdGhPdXRMaW1pdCc6IGZ1bmN0aW9uKGFtb3VudCwgcmVjZWl2ZXIsIHJlYXNvbiApe1xuXHRcdFx0dmFyIGZ1dCA9IG5ldyBGdXR1cmUoKTtcblx0XHRcdHZhciBhbW91bnRJbldlaSA9IHdlYjMudXRpbHMudG9XZWkoYW1vdW50LCBcImV0aGVyXCIpO1xuXHRcdFx0dmFyIHNlbmRlciA9IGFjY291bnQwO1xuXHRcdFx0dmFyIGRhaWx5V2FsbGV0ID0gbmV3IHdlYjMuZXRoLkNvbnRyYWN0KG11bHRpc2lnRGFpbHlMaW1pdEFCSS5hYmksIG11bHRpc2lnRGFpbHlMaW1pdEFCSS5hZGRyZXNzKTtcblxuXHRcdFx0ZGFpbHlXYWxsZXQubWV0aG9kcy5zdWJtaXRUcmFuc2FjdGlvbihyZWNlaXZlciwgYW1vdW50SW5XZWksIHdlYjMudXRpbHMuYXNjaWlUb0hleChcIlwiKSwgd2ViMy51dGlscy5hc2NpaVRvSGV4KHJlYXNvbikpXG5cdFx0XHQuc2VuZCh7XG5cdFx0XHRcdGZyb206IHNlbmRlcixcblx0XHRcdFx0Z2FzOiAxNDAwMDAgLy9UT0RPXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXsgY29uc29sZS5lcnJvcihlcnJvcik7IH0pXG5cdFx0XHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIGZ1bmN0aW9uKHRyYW5zYWN0aW9uSGFzaCl7IGNvbnNvbGUubG9nKFwidHJhbnNhY3Rpb25IYXNoOiBcIiArIHRyYW5zYWN0aW9uSGFzaCk7IH0pXG5cdFx0XHQub24oJ3JlY2VpcHQnLCBmdW5jdGlvbihyZWNlaXB0KXtcblx0XHRcdCAgIGNvbnNvbGUubG9nKFwicmVjZWlwdDogXCIrIHJlY2VpcHQuY29udHJhY3RBZGRyZXNzKSAvLyBjb250YWlucyB0aGUgbmV3IGNvbnRyYWN0IGFkZHJlc3Ncblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbmZpcm1hdGlvbicsIGZ1bmN0aW9uKGNvbmZpcm1hdGlvbk51bWJlciwgcmVjZWlwdCl7IGNvbnNvbGUubG9nKCdjb25maXJtYXRpb24gTm86ICcrIGNvbmZpcm1hdGlvbk51bWJlcisgXCIgXCIrIHJlY2VpcHQpIH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbih0cmFuc2FjdGlvbil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiSUQ6XCIpO1xuXHRcdFx0XHR2YXIgdHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmV2ZW50cy5TdWJtaXNzaW9uLnJldHVyblZhbHVlcy50cmFuc2FjdGlvbklkO1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0cmFuc2FjdGlvbklkKTtcblxuXHRcdFx0XHRkYWlseVdhbGxldC5tZXRob2RzLmV4ZWN1dGVEYWlseVRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uSWQpLy9UT0RPXG5cdFx0XHRcdC5zZW5kKHtcblx0XHRcdFx0XHRmcm9tOiBzZW5kZXIsXG5cdFx0XHRcdFx0Z2FzOiAxNDAwMDAgLy9UT0RPXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcil7Y29uc29sZS5sb2coXCJlcnJvclwiKTsgY29uc29sZS5lcnJvcihlcnJvcik7IGZ1dC50aHJvdyhlcnJvcik7fSlcblx0XHRcdFx0Lm9uKCd0cmFuc2FjdGlvbkhhc2gnLCBmdW5jdGlvbih0cmFuc2FjdGlvbkhhc2gpeyBjb25zb2xlLmxvZyhcInRyYW5zYWN0aW9uSGFzaDogXCIgKyB0cmFuc2FjdGlvbkhhc2gpOyB9KVxuXHRcdFx0XHQub24oJ3JlY2VpcHQnLCBmdW5jdGlvbihyZWNlaXB0KXtcblx0XHRcdFx0ICAgY29uc29sZS5sb2coXCJyZWNlaXB0OiBcIisgcmVjZWlwdC5jb250cmFjdEFkZHJlc3MpIC8vIGNvbnRhaW5zIHRoZSBuZXcgY29udHJhY3QgYWRkcmVzc1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2NvbmZpcm1hdGlvbicsIGZ1bmN0aW9uKGNvbmZpcm1hdGlvbk51bWJlciwgcmVjZWlwdCl7IGNvbnNvbGUubG9nKCdjb25maXJtYXRpb24gTm86ICcrIGNvbmZpcm1hdGlvbk51bWJlcisgXCIgXCIrIHJlY2VpcHQpIH0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHRyYW5zYWN0aW9uKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh0cmFuc2FjdGlvbik7XG5cdFx0XHRcdFx0ZnV0LnJldHVybih0cnVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGZ1dC53YWl0KCk7XG5cdFx0fSxcblxuXHRcdCdjb25maXJtVHJhbnNhY3Rpb24nIDogZnVuY3Rpb24odHJhbnNhY3Rpb25JZCl7XG5cdFx0XHR2YXIgZnV0ID0gbmV3IEZ1dHVyZSgpO1xuXHRcdFx0dmFyIHNlbmRlciA9IGFjY291bnQxO1xuXHRcdFx0dmFyIGRhaWx5V2FsbGV0ID0gbmV3IHdlYjMuZXRoLkNvbnRyYWN0KG11bHRpc2lnRGFpbHlMaW1pdEFCSS5hYmksIG11bHRpc2lnRGFpbHlMaW1pdEFCSS5hZGRyZXNzKTtcblx0XHRcdGRhaWx5V2FsbGV0Lm1ldGhvZHMuY29uZmlybVRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uSWQpXG5cdFx0XHQuc2VuZCh7XG5cdFx0XHRcdGZyb206IHNlbmRlcixcblx0XHRcdFx0Z2FzOiAxNDAwMDAgLy9UT0RPXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXsgY29uc29sZS5lcnJvcihlcnJvcik7IH0pXG5cdFx0XHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIGZ1bmN0aW9uKHRyYW5zYWN0aW9uSGFzaCl7IGNvbnNvbGUubG9nKFwidHJhbnNhY3Rpb25IYXNoOiBcIiArIHRyYW5zYWN0aW9uSGFzaCk7IH0pXG5cdFx0XHQub24oJ3JlY2VpcHQnLCBmdW5jdGlvbihyZWNlaXB0KXtcblx0XHRcdCAgIGNvbnNvbGUubG9nKFwicmVjZWlwdDogXCIrIHJlY2VpcHQuY29udHJhY3RBZGRyZXNzKSAvLyBjb250YWlucyB0aGUgbmV3IGNvbnRyYWN0IGFkZHJlc3Ncblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbmZpcm1hdGlvbicsIGZ1bmN0aW9uKGNvbmZpcm1hdGlvbk51bWJlciwgcmVjZWlwdCl7IGNvbnNvbGUubG9nKCdjb25maXJtYXRpb24gTm86ICcrIGNvbmZpcm1hdGlvbk51bWJlcisgXCIgXCIrIHJlY2VpcHQpIH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbih0cmFuc2FjdGlvbil7XG5cdFx0XHRcdGZ1dC5yZXR1cm4odHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmdXQud2FpdCgpO1xuXHRcdH0sXG5cblx0XHQnZ2V0VHJhbnNOdW1iZXInOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGZ1dCA9IG5ldyBGdXR1cmUoKTtcblx0XHRcdHZhciBkYWlseVdhbGxldCA9IG5ldyB3ZWIzLmV0aC5Db250cmFjdChtdWx0aXNpZ0RhaWx5TGltaXRBQkkuYWJpLCBtdWx0aXNpZ0RhaWx5TGltaXRBQkkuYWRkcmVzcyk7XG5cdFx0XHR2YXIgc2VuZGVyID0gYWNjb3VudDA7XG5cdFx0XHQvLyBkYWlseVdhbGxldC5tZXRob2RzLnRyYW5zYWN0aW9uc1xuXHRcdFx0ZGFpbHlXYWxsZXQubWV0aG9kcy5nZXRUcmFuc2FjdGlvbkNvdW50KHRydWUsIHRydWUpLmNhbGwoe1xuXHRcdFx0XHRmcm9tOiBzZW5kZXIsXG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24odHJhbnNfbnVtKXtcblx0XHRcdFx0Y29uc29sZS5sb2codHJhbnNfbnVtKTtcblx0XHRcdFx0aWYodHJhbnNfbnVtICYmIHRyYW5zX251bSAhPSAwKXtcblx0XHRcdFx0XHRmdXQucmV0dXJuKHRyYW5zX251bSk7XG5cblxuXHRcdFx0XHR9ZWxzZSB7XG5cdFx0XHRcdFx0ZnV0LnRocm93KFwiTm8gaGlzdG9yeSBmb3VuZFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZnV0LndhaXQoKTtcblx0XHR9LFxuXG5cdFx0J3Nob3dIaXN0b3J5JzogZnVuY3Rpb24odHJhbnNfbnVtKXtcblx0XHRcdHZhciBpbmRleEFycmF5ID0gW107XG5cdFx0XHR2YXIgc2VuZGVyID0gYWNjb3VudDA7XG5cdFx0XHR2YXIgZGFpbHlXYWxsZXQgPSBuZXcgd2ViMy5ldGguQ29udHJhY3QobXVsdGlzaWdEYWlseUxpbWl0QUJJLmFiaSwgbXVsdGlzaWdEYWlseUxpbWl0QUJJLmFkZHJlc3MpO1xuXHRcdFx0Zm9yKHZhciBpID0gMCA7IGkgPCB0cmFuc19udW0gOyBpKyspe1xuXG5cdFx0XHRcdGluZGV4QXJyYXkucHVzaChpKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5sb2coXCJAQEBAXCIpO1xuXHRcdFx0Y29uc29sZS5sb2cobXVsdGlzaWdEYWlseUxpbWl0QUJJLmFkZHJlc3MpO1xuXHRcdFx0dmFyIGZ1dHMgPSBfLm1hcChpbmRleEFycmF5LGZ1bmN0aW9uKGl0ZW0sIGluZGV4KXtcblx0XHRcdFx0dmFyIGZ1dCA9IG5ldyBGdXR1cmUoKTtcblx0XHRcdFx0dmFyIG9uQ29tcGxldGUgPSBmdXQucmVzb2x2ZXIoKTtcblx0XHRcdFx0XG5cdFx0XHRcdGRhaWx5V2FsbGV0Lm1ldGhvZHMudHJhbnNhY3Rpb25zKGl0ZW0pLmNhbGwoe2Zyb206IHNlbmRlcn0sIGZ1bmN0aW9uKGVycixyZXN1bHQpe1xuXHRcdFx0XHRcdGlmKGVycil7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyh3ZWIzKTtcblx0XHRcdFx0XHRcdHJlc3VsdC5yZWFzb24gPSB3ZWIzLnV0aWxzLnRvQXNjaWkocmVzdWx0LnJlYXNvbikucmVwbGFjZSgvXFwwL2csICcnKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdC5yZWFzb24pXG5cdFx0XHRcdFx0XHRvbkNvbXBsZXRlKGVyciwgcmVzdWx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gZnV0O1xuXHRcdFx0fSlcblxuXHRcdFx0RnV0dXJlLndhaXQoZnV0cyk7XG5cdFx0XHRyZXR1cm4gXy5pbnZva2UoZnV0cywgJ2dldCcpO1xuXHRcdH1cblx0fSk7XG59KTtcbiJdfQ==
