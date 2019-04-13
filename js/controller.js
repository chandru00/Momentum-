"use strict";

window.momentum = window.momentum || {};

// Core - time, image

momentum.Core = function() {
  this.timeStr = "";
  this.quoteStr = "";
  this.weatherStr = "";
  this.ampm = "AM";
  this.arrayData= [];
  this.salutation = "morning";
  this.location = "";
  this.timeEl = $("#time");
  this.quoteEl = $("#quote-text");
  this.weatherEl = $("#weather");
  this.greetingEl = $("#greetings");
  this.ampmEl = $("#ampm");
  this.city = $("#location");
  this.lat;
  this.lon;
  
  // weather controller
  this.weatherCtrl = new momentum.WeatherCtrl();
  
  // quote controllerx
  this.quoteCtrl = new momentum.QuoteCtrl();
	this.addTodoList();
};

momentum.Core.prototype = {
	// `setTime` method
	// This method should calculate the current time and save it to timeStr in the form HH:MM, like: 12:01 or 21:34.
	// 
	// hint. check out the `Date` object! Use `getHours` and `getMinutes`.
  setTime: function() {
		// YOUR CODE HERE
		var date = new Date();
		var hours = date.getHours();
		if(hours>12){
			this.salutation = "afternoon";
		}
		if(hours>18){
			this.salutation = "evening";
		}
		if(hours > 11 && hours < 24){
			this.ampm = "PM";
		}
		if(hours > 12){
			hours -= 12;
		}
		var mins = date.getMinutes();
		if(mins < 10){
			var txt = '0' + mins;
			mins = txt; 
		}
		var ret = '';
		ret = ret + hours + ':' + mins;
		this.timeStr = ret;
  },
	// `setQuote` method
	// This method should set the `quoteStr` property of the momentum core. This method will be used as the callback for quoteCtrl's `fetchQuote` function.
	// 
	// hint. check out the `Date` object! Use `getHours` and `getMinutes`.
	// hint. figure out what kind of response the quoteData is going to be, and see how you might be able to access the quote of the day from that.
  setQuote: function(quoteData) {
		this.quoteStr = quoteData.message;
		this.quoteEl.text(this.quoteStr);
		this.render();
  },
	// `setWeather` method
	// This method should set the `weatherStr` property of the momentum core. This method will be used as the callback for weatherCtrl's `fetchWeather` function.
	// 
	// hint. figure out what kind of response the weatherData is going to be, and see how you might be able to access the quote of the day from that.
  setWeather: function(weatherData) {
		// YOUR CODE HERE
		this.weatherStr = Math.floor(weatherData.main.temp - 273.15);
		this.location = weatherData.name;
		this.render();
  },
	// `updateTime` method
	// This function should call setTime() so that this.timeStr is updated.
  updateTime: function() {
		// YOUR CODE HERE
		this.setTime();
  },
	// `updateWeather` method
	// This function should call weatherCtrl.fetchWeather and pass in this.setWeather as the callback.
	//
	// note. you might run into scoping issues again. You should know how to solve them by now, using .call, .apply, or .bind.
  updateWeather: function() {
	// YOUR CODE HERE
	this.weatherCtrl.fetchWeather(this.lat, this.lon, this.setWeather.bind(this));
  },
	// `updateQuote` method
	// This function should call quoteCtrl.fetchQuote and pass in this.setQuote as the callback.
	//
	// note. you might run into scoping issues again. You should know how to solve them by now, using .call, .apply, or .bind.
	updateQuote: function() {
		// YOUR CODE HERE
		this.quoteCtrl.fetchQuote(this.setQuote.bind(this));

	},
	// `start` method
	// This method will call some of the `update...` methods. This function will be called when the page has finished loading, so that Momentum can start off with the more up-to-date data.
	start: function() {
		// get location
		if (!navigator.geolocation){
		  throw "Geolocation not supported!";
		}

		function error() {
		  throw "Error occured!";
		};

		navigator.geolocation.getCurrentPosition(function(position) {
		  console.log("EXECUTING");
		  this.lat = position.coords.latitude;
		  this.lon = position.coords.longitude;
		  console.log(this.lat, this.lon);
		  this.updateWeather();
		}.bind(this), error);
		this.setTime();
		this.updateQuote();
		this.render();

		
		

	},
	// `render` method
	// This method should "render" the time, quote and weather strings on your page by replacing the text value of your elements with their respective properties.
	// ex. this.timeStr will be rendered on to the screen using this.timeEl.text(this.timeStr);
  	render: function() {
		// YOUR CODE HERE
		this.timeEl.text(this.timeStr);
		this.name =localStorage.getItem("name");
		(localStorage.getItem("name")) ? this.greetingEl.text("Good " + this.salutation +", "+this.name) : this.initialName();
		if(this.name ){
			$('#greetings').attr("contenteditable","false");
			$('#greetings').css("border-bottom","0px");
		}
		this.ampmEl.text(this.ampm);
		this.weatherEl.text(this.weatherStr);
		this.quoteEl.text(this.quoteStr);
		this.city.text(this.location);
		this.goalSetting();

  },

  initialName: function(){
  	let ele = $('#greetings');
  	ele.empty();
  	let _this =this;
  	$('#greetings').unbind("keypress");
  	$('#greetings').on('keypress',function(event) {
  		console.log(event);
  		let target_ele= $(event.target);
		if(event.which == 13) {
			_this.name = target_ele.text();
			localStorage.setItem("name",_this.name);
			_this.greetingEl.text("Good " + _this.salutation +", "+_this.name);
			ele.attr("contenteditable","false");
			ele.css("border-bottom","0px");
		}
	});
  },
	goalSetting: function(){
  		if (localStorage.getItem("goal")){
			$('.focus-wrapper').css("display","none");
			$('.display-text').css("display","block");
			$('.focus-name').text(localStorage.getItem("goal"));
		}
		$('#input-goal-today').unbind("keypress");
		$('#input-goal-today').on('keypress',function(event){
			if(event.which == 13) {
				let goalText= $(event.target).val();
				$('.focus-wrapper').css("display","none");
				localStorage.setItem("goal",goalText);
				console.log(goalText);
				$('.display-text').css("display","block");
				$('.focus-name').text(goalText);

			}
		});
		$('.closing-icon').on('click',function(){
			$('.focus-wrapper').css("display","block");
			localStorage.removeItem("goal");
			$('#input-goal-today').val("");
			$('.display-text').css("display","none");

		});
	},
	addTodoList:function(event){
  		$('.typed-data').unbind("keypress");
  		$('.typed-data').on('keypress',function(event){
  			if(event.which == 13){
  				var targetEle = $(event.target);
  				var ele_tag="";
  				if(targetEle.val().length>0) {
					let ele_text = targetEle.val();
					var listData = localStorage.getItem("data-list");
					var listArray =[];
					if(listData){
						listArray = JSON.parse(listData);
						listArray.push(ele_text);
						localStorage.setItem("data-list",JSON.stringify(listArray));
					}else{
						listArray.push(ele_text);
						localStorage.setItem("data-list",JSON.stringify(listArray));
					}
					targetEle.val("");
					var ele_tag = '<div class="add-list"><input type="text" value='+ele_text+' class="list-data" disabled><div class="close-icon-list">x</div></div>';
					$('.button-wrapper').append(ele_tag);

				}
				$('.close-icon-list').unbind('click');
				$('.close-icon-list').on('click',function(event){
					var curr = JSON.parse(localStorage.getItem("data-list"));
					console.log($('.close-icon-list').index($(event.target)),$(event.target));
					curr.splice([$('.close-icon-list').index($(event.target))],1);
					$(event.target).parent().remove();
					localStorage.setItem("data-list",JSON.stringify(curr));
				});


			}
		});
		if(localStorage.getItem("data-list")) {
			var ele_t ="";
			JSON.parse(localStorage.getItem("data-list")).forEach(function (value, data) {
				ele_t += '<div class="add-list"><input type="text" value='+value+' class="list-data" disabled><div class="close-icon-list">x</div></div>';
			});
			$('.button-wrapper').append(ele_t);
			$('.close-icon-list').unbind('click');
			$('.close-icon-list').on('click',function(event){
				var curr = JSON.parse(localStorage.getItem("data-list"));
				curr.splice([$('.close-icon-list').index($(event.target))],1);
				$(event.target).parent().remove();
				localStorage.setItem("data-list",JSON.stringify(curr));
			});
		}

	}
};
