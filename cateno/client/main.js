import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Cookies } from 'meteor/ostrio:cookies';

import './main.html';

const cookies = new Cookies();

Template.login.events({
	'submit #login': function(event){
		event.preventDefault();
		var usrname = event.target.name.value;
		var usrpwd = event.target.pwd.value;
		console.log("usrname:" + usrname + " password:" + usrpwd);
		sweetAlert("Wait for sync!");
		Meteor.call(
			'updatePrice',
			function (error, result) {
				if (error) {
					console.error(error);
				}else {
					if(usrname == "company"){
						Meteor.call('getEthAddress', usrname, function(err, result){
							if(!err){
								// console.log(result);
								cookies.set('address', result);
								Router.go('/dashboardc'); 
							}else {
								console.log(err);
							}
						});
					}else if(usrname == "investor"){
						Router.go('/dashboardi'); 
					}

				}
			}
		);

		

	}
});

Template.company.onCreated(async function(){
	this.transactions = new ReactiveVar([]);
	const mySelf = this;
	var re = new Promise( resolve => {
		Meteor.call(
			'getTransNumber',
			async function (error, result) {
				if (error) {
					console.error(error);
				}else {
					console.log(result);
					await Meteor.call('showHistory', result, function (err, transactions) {
						if(err){
							console.error(err);
						}else{
							transhistory = transactions;
							resolve(transactions);
						}
					});
				} 
			}
		)
	});
	var test = re.then(function(res){
		mySelf.transactions.set(res);
	});
	
});



Template.company.helpers({
	history: function () {
		var raw = Template.instance().transactions.get();
		var show = []
		console.log(raw);
		for(var i = 0; i < raw.length; i++){
			var executed = raw[i].executed ;
			var destination = raw[i].destination;
			var value = raw[i].value * 0.000000000000000001;
			var reason = raw[i].reason;
			var showObject = {executed: executed, destination: destination, reason: reason,value: value};
			show.push(showObject);
		}
		return show;
	}
});

Template.investor.onCreated(async function(){
	this.transactions = new ReactiveVar([]);
	const mySelf = this;
	var re = new Promise( resolve => {
		Meteor.call(
			'getTransNumber',
			async function (error, result) {
				if (error) {
					console.error(error);
				}else {
					console.log(result);
					await Meteor.call('showHistory', result, function (err, transactions) {
						if(err){
							console.error(err);
						}else{
							transhistory = transactions;
							resolve(transactions);
						}
					});
				} 
			}
		)
	});
	var test = re.then(function(res){
		mySelf.transactions.set(res);
	});
	
});



Template.investor.helpers({
	history: function () {
		var raw = Template.instance().transactions.get();
		var show = []
		for(var i = 0; i < raw.length; i++){
			var executed = raw[i].executed ;
			var destination = raw[i].destination;
			var value = raw[i].value * 0.000000000000000001;
			var reason = raw[i].reason;
			var showObject = {id: i,executed: executed, destination: destination,reason:reason, value: value};
			show.push(showObject);
		}
		return show;
	}
});


Template.investor.events({
	'click .confirm-button': function(event){
		console.log(event.target.value);
		sweetAlert("Contract Processing", "");
		Meteor.call(
			'confirmTransaction',
			event.target.value,
			function (error, result) {
				if (error) {
					console.error(error);
				}else {
					if(result){
						sweetAlert("Transfer Success!", "The contract has executed", "success");
					}
				}
			}
		);
	}
});

Template.company.events({
	'click #new_request': function () {
		Router.go('/request'); 
	},
	// 'click .update-button': async function(){

	// 	Template.instance().transactions.set(await Meteor.call(
	// 		'getTransNumber',
	// 		async function (error, result) {
	// 			if (error) {
	// 				console.error(error);
	// 			}else {
	// 				console.log(result);
	// 				await Meteor.call('showHistory', result, function (err, transactions) {
	// 					if(err){

	// 					}else{
	// 						console.log(transactions);
	// 						return transactions;
	// 					}
	// 				});
	// 			} 
	// 		}
	// 	));
	// }, 
});

Template.request.events({
	'click .leave-button': function () {
		Router.go('/dashboardc'); 
	},

	'change #rd_free': function(){
		$('.milestone').addClass("hide");

		
	},

	'change #rd_apvl': function(){
		$('.milestone').addClass("hide");
	},

	'change #rd_mlst': function(){
		$('.milestone').removeClass("hide");
	},

	'submit form': function(){
		event.preventDefault();

		console.log($('input[name=request_type]:checked').val());
		switch ($('input[name=request_type]:checked').val()) {
			case 'free':
				sweetAlert("Contract Processing", "");
				Meteor.call(
					'requestWithOutLimit',
					$('#transfer_amount').val(),
					$('#receiver_account').val(),
					$('#transfer_reason').val(), 
					function (error, result) {
						if (error) {
							console.error(error);
						}else {
							sweetAlert("Transfer Success!", "The contract has executed", "success");
						}
					}
				);
				// Meteor.call('deployWallet', function (err,result){
				// 	if(err){
				// 		console.error(err);
				// 	}else{
				// 		console.log(result);
				// 	}
				// });
				break;
			case 'approval':
				sweetAlert("Contract Processing", "");
				Meteor.call(
					'submitTransaction',
					$('#transfer_amount').val(),
					$('#receiver_account').val(),
					$('#transfer_reason').val(), 
					function (error, result) {
						if (error) {
							console.error(error);
						}else {
							sweetAlert("Transfer Success!", "The contract has executed", "success");
						}
					}
				);
				break;
			case 'milestone':
				sweetAlert("Contract Processing", "");
				console.log($('#mlst_target').val())
				Meteor.call(
					'settingMilestone',
					$('#transfer_amount').val(),
					$('#receiver_account').val(),
					$('#transfer_reason').val(),
					$('#mlst_target').val(), 
					function (error, result) {
						if (error) {
							console.error(error);
						}else {
							sweetAlert("Transfer Success!", "The contract has executed", "success");
						}
					}
				);
				break;
			default:
				// statements_def
				break;
		}


	}

});