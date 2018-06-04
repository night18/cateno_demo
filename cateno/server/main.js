import { Meteor } from 'meteor/meteor';
import Web3 from 'web3';
import multisigDailyLimitABI from './contract/multiSigDailyLimit.json';

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.net.isListening().then(console.log);
Future = Npm.require('fibers/future')	

var account0 = "0xa9f64fe1c99c1bb316eae97be90ce35db2d105bc";
var account1 = "0xfa61f9280de613a4b5b91c385739fc6a54d0f389";


Meteor.startup(() => {
  // code to run on server at startup

	Meteor.methods({
		'getEthAddress': function(name){
			
  			var fut = new Future();
			if(name == "company"){
				// fut.return({getEthAddress:web3.eth.coinbase});
     			// return fut.wait();
     			web3.eth.getCoinbase((err, cb) =>{
     				if(err){
     					fut.throw(err);
     				}else {
     					fut.return(cb);
     				}
     			});
     			return fut.wait();
			}else if(name == "investor"){
				
			}
		},
		'deployWallet':function(){
			let _executor = account0;
			let _supervisors = account1;
			let _required = 1;
			let _dailyLimit = web3.utils.toWei("20", "ether");
 			let multisigwalletwithdailylimitContract = new web3.eth.Contract(multisigDailyLimitABI.abi);
 			// console.log(multisigDailyLimitABI.binHx);
 			multisigwalletwithdailylimitContract.deploy({
 				data: multisigDailyLimitABI.binHx, 
 				arguments: [_executor, _supervisors, _required, _dailyLimit]
 			})
			.send({
				from: _executor,
				gas: 3000000,
   				gasPrice: '300000000'
			}, function(error, HxTrans){
				if(error){
					console.error(error);
				}else {
					console.log("HxTrans: "+ HxTrans);
				}
			})
			.on('error', function(error){ console.error(error); })
			.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
			.on('receipt', function(receipt){
			   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
			})
			.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
			.then(function(newContractInstance){
				console.log('!!');
			    console.log(newContractInstance.options.address) // instance with the new contract address
			});
		},

		'submitTransaction': function(amount, receiver, reason ){
			var fut = new Future();
			var amountInWei = web3.utils.toWei(amount, "ether"); 
			var sender = account0;
			var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);

			dailyWallet.methods.submitTransaction(receiver, amountInWei, web3.utils.asciiToHex(""), web3.utils.asciiToHex(reason))
			.send({
				from: sender,
				gas: 300000 //TODO
			})
			.on('error', function(error){ console.error(error); })
			.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
			.on('receipt', function(receipt){
			   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
			})
			.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
			.then(function(transaction){
				console.log("ID:");
				var transactionId = transaction.events.Submission.returnValues.transactionId;
				console.log(transactionId);
				fut.return(true);
			});

			return fut.wait();
		},

		'settingMilestone': function(amount, receiver, reason, milestone){
			var fut = new Future();
			var amountInWei = web3.utils.toWei(amount, "ether"); 
			var sender = account0;
			var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
			console.log(Number(milestone))

			dailyWallet.methods.settingMilestone(receiver, amountInWei, web3.utils.asciiToHex(""), web3.utils.asciiToHex(reason), milestone)
			.send({
				from: sender,
				gas: 450000 //TODO
			})
			.on('error', function(error){ console.error(error); })
			.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
			.on('receipt', function(receipt){
			   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
			})
			.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
			.then(function(transaction){
				console.log("ID:");
				var transactionId = transaction.events.Submission.returnValues.transactionId;
				console.log(transactionId);
				fut.return(true);
			});

			return fut.wait();
		},

		'updatePrice': function(){
			var fut = new Future();
			var sender = account0;
			var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);

			dailyWallet.methods.updatePrice()
			.send({
				from: sender,
				gas: 140000, //TODO
				value: 500000,
			})
			.on('error', function(error){ console.error(error); })
			.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
			.on('receipt', function(receipt){
			   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
			})
			.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
			.then(function(transaction){
				console.log("!!!");
				dailyWallet.methods.checkMilestone()
				.send({
					from: sender,
					gas: 300000 //TODO
				})
				.on('error', function(error){console.log("error"); console.error(error); fut.throw(error);})
				.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
				.on('receipt', function(receipt){
				   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
				})
				.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
				.then(function(transaction){
					console.log(transaction);
					fut.return(true);
				});
			});

			return fut.wait();
		},

		'requestWithOutLimit': function(amount, receiver, reason ){
			var fut = new Future();
			var amountInWei = web3.utils.toWei(amount, "ether"); 
			var sender = account0;
			var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
			
			dailyWallet.methods.submitTransaction(receiver, amountInWei, web3.utils.asciiToHex(""), web3.utils.asciiToHex(reason))
			.send({
				from: sender,
				gas: 140000 //TODO
			})
			.on('error', function(error){ console.error(error); })
			.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
			.on('receipt', function(receipt){
			   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
			})
			.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
			.then(function(transaction){
				console.log("ID:");
				var transactionId = transaction.events.Submission.returnValues.transactionId;
				console.log(transactionId);

				dailyWallet.methods.executeDailyTransaction(transactionId)//TODO
				.send({
					from: sender,
					gas: 140000 //TODO
				})
				.on('error', function(error){console.log("error"); console.error(error); fut.throw(error);})
				.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
				.on('receipt', function(receipt){
				   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
				})
				.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
				.then(function(transaction){
					console.log(transaction);
					fut.return(true);
				});
			});

			return fut.wait();
		},

		'confirmTransaction' : function(transactionId){
			var fut = new Future();
			var sender = account1;
			var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
			dailyWallet.methods.confirmTransaction(transactionId)
			.send({
				from: sender,
				gas: 140000 //TODO
			})
			.on('error', function(error){ console.error(error); })
			.on('transactionHash', function(transactionHash){ console.log("transactionHash: " + transactionHash); })
			.on('receipt', function(receipt){
			   console.log("receipt: "+ receipt.contractAddress) // contains the new contract address
			})
			.on('confirmation', function(confirmationNumber, receipt){ console.log('confirmation No: '+ confirmationNumber+ " "+ receipt) })
			.then(function(transaction){
				fut.return(true);
			});
			return fut.wait();
		},

		'getTransNumber': function(){
			var fut = new Future();
			var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
			var sender = account0;
			// dailyWallet.methods.transactions
			dailyWallet.methods.getTransactionCount(true, true).call({
				from: sender,
			})
			.then(function(trans_num){
				console.log(trans_num);
				if(trans_num && trans_num != 0){
					fut.return(trans_num);
					
						
				}else {
					fut.throw("No history found");
				}
			});	
			return fut.wait();	 
		},

		'showHistory': function(trans_num){
			var indexArray = [];
			var sender = account1;
			var dailyWallet = new web3.eth.Contract(multisigDailyLimitABI.abi, multisigDailyLimitABI.address);
			for(var i = 0 ; i < trans_num ; i++){
				
				indexArray.push(i);
			}

			var futs = _.map(indexArray,function(item, index){
				var fut = new Future();
				var onComplete = fut.resolver();

				dailyWallet.methods.transactions(item).call({from: sender}, function(err,result){
					if(err){
						console.error(err);
					}else{
						// console.log(web3);
						result.reason = web3.utils.toAscii(result.reason).replace(/\0/g, '');
						console.log(result.reason)
						onComplete(err, result);
					}
				});
				return fut;
			})

			Future.wait(futs);
			return _.invoke(futs, 'get');
		}
	});
});
