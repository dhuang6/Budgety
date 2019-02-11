//anonymous function wrapped in () is a module
//a module is equated to a chapter in a book that allows the code to be maintained. 
//in javascript what is inside of a () can't be a statement
//budget controller
var budgetController = (function(){
	//function constructor you use a capital at the beginning to denote the difference. We will have 
	//lots of expenses so this will be the easiest way to get them made.
	var Expense = function(id, description,value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	//grabs the total income and calculates the %
	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0 ){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
		
	};
	//grabs the data and returns it.
	Expense.prototype.getPercentage = function(){
		return this.percentage; 
	}

	//same as expense
	var Income = function(id, description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type){
		var sum = 0;
		//type = exp or inc this is a template for calculating both
		data.allItems[type].forEach(function(cur){
			//add each value to the previous for both inc and expenses.
			sum += cur.value;
		});
		//move the previously calculated sum to the data structure under totals.
		data.totals[type] = sum; 
	}

  	
   //data structure to hold our expenses and income.
	var data = {
		allItems : {
			exp: [],
			inc: []
		},
		totals : {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return {//allows us a method to add an item to our data structure
		//type is it a income or exp

		addItem: function(type, descript, val ){
			var newItem, ID;
			//to get the id to continue to go up by 1
			//[1,2,3,4,5] = how our data currently looks
			//because we are going to have the option to delete items we want to just continue from the last item of the array
			//you access that using allItems.length
			//to get the next number to be +1 

			//id for a new item
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
		
			
			//create new item based on 'inc' or 'exp' type
			if(type ==='exp'){
		 newItem = new Expense(ID, descript, val);
			}else if(type === 'inc'){
				newItem = new Income(ID, descript,val)
			}
			//push into our data structure
			data.allItems[type].push(newItem);
			//allows you to access the value public.
				return newItem;
		},

		deleteItem: function(type, id){//map returns a brand new array.
			var ids, index;
			//we need to get the current id
			//ids = [1 2 4 6 8];
			//index = 3
			ids = data.allItems[type].map(function(current){
				return current.id;
			});
			//return the index of the id inside the array.
			index = ids.indexOf(id);

			if(index !== -1){
			//if index exists remove it 
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function(){
			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			//calculate budget: income - expenses we are creating a new entry in our data structure.
			data.budget = data.totals.inc - data.totals.exp;
			//calculate the percentage of income that we spend.
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
			


		},

		calculatePercentages: function(){
			/*
				expenses
		 		a = 20
		 		b = 10
		 		c = 40
		 		income = 100


			*/

			//goes through the exp array
			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});

		},

		getPercentages: function(){
			var allPerc;

			allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});

			return allPerc;
		},

		//this function only purpose is to return data.
		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		testing: function(){
			console.log(data);
		}
	}

})();
//these two other controllers don't know each other exist.
var UIController = (function(){//ui controller
      
      var DOMstrings = {
      		inputType: '.add__type',
      		inputDescription: '.add__description',
      		inputValue: '.add__value',
      		inputBtn: '.add__btn',
      		incomeContainer : '.income__list',
      		expensesContainer : '.expenses__list',
      		budgetLabel: '.budget__value',
      		incomeLabel: '.budget__income--value',
      		expensesLabel: '.budget__expenses--value',
      		percentageLabel: '.budget__expenses--percentage',
      		container: '.container',
      		expensesPercLabel: '.item__percentage',
      		dateLabel: '.budget__title--month'
      };
      	var formatNumber = function(num, type){
      		var numSplit, int, dec, type;	
      		/*
		      + or - before number based on inc or exp
		      exactly 2 decimal pts
		      comma separating the thousands.
		      ex:

		      2310.4567 -> + 2,310.46
		      2000 -> 2,000.00

		      toFixed changes a num to a string the num in () = how many decimals
      		*/

      		//overwriting the number as it's absolute value.
      		num = Math.abs(num);

      		//using the obj method toFixed() see above for how it works.
      		num = num.toFixed(2);

      		//split the string into 2310 and 46
      		numSplit = num.split('.');
      		
      		//adding in the comma if the num is greater than 3
      		int = numSplit[0];
      		if(int.length > 3 ){
      			/*
      			say the number is 5
      			int.substr(0, int.length - 3) start at index 0 
      			5 - 3 = 2

      			ex: 23674


      			int.substr(1,3) start at position 1 read 3 num.

      			so the comman gets added between position 0 and 1
      			*/
      			//first number is starting second is the number of elements. so int.substr(0 , int.length - 3 ) you start at 0 and read 2 elements
      			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 2310 output = 2,310

      		}

      		//setting up the + / - infront of num.
      		dec = numSplit[1];
      		//tertiary statement
      		type === 'exp' ? sign = '-' : sign = '+';
      		//type is either exp or put the + then put in the decimal
      		return (type  === 'exp' ?  '-' : '+' ) + ' ' + int + '.' + dec;


      	};

         //we are using this as a callback function for reuseability. 
      	var	nodeListForEach = function(list, callback){
      			for(let i = 0; i < list.length; i++){

      				callback(list[i], i);
      			}
      		};


      return {//holds the value of the exp / inc item within the object.
      	getInput : function(){

      		return {
      				type : document.querySelector(DOMstrings.inputType).value, //will be either income / expense
      			description : document.querySelector(DOMstrings.inputDescription).value,
      			//this was a string that we transformed into a integer by using parseFloat.
      			value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
      	},

      	addListItem: function(obj, type){
      		var html, newHtml, element;
      			//create HTML string with placeholder text
      			if(type === 'inc'){
      			element = DOMstrings.incomeContainer;
      			//we define the id for income here.
      			html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      			}

      			 else if(type === 'exp'){
      			element = DOMstrings.expensesContainer;
      			//we define the id for expense here. only ones in html
      			html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }        
                                
                //replace the placeholder text with actual data
                	newHtml = html.replace('%id%', obj.id);
					newHtml = newHtml.replace('%description%', obj.description);
                	newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      			//insert html into dom after the last item but in the same container as the previous entry.
      			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      	},

      	deleteListItem: function(selectorID){
      		var el;
      		//el is the budget item you are removing.
      		el = document.getElementById(selectorID);
      		el.parentNode.removeChild(el);
      	},

      	clearFields: function(){
      		var fields, fieldsArr;

      		//selecting the input areas where we put or inc / exps
      	    fields = document.querySelectorAll(DOMstrings.inputDescription + ' , ' + DOMstrings.inputValue);

      	    //turns the entry data into an array to be removed.
      	    fieldsArr = Array.prototype.slice.call(fields);

      	    //turns the values left in after to be blank.
      	    fieldsArr.forEach(function (current, index, array){
      	    		current.value = "";
      	    });
      	    //allows us to move back to the first entry after entering in information.
      	    fieldsArr[0].focus();
      	},
      	//replacing the default text on the webpage with info entered by user.
      	displayBudget: function(obj){
      		var type; 

      		//because type isn't defined here we write a tertiary statement
      		obj.budget > 0 ? type = 'inc' : type = 'exp';

      		document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      		document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      		document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      		

      		if(obj.percentage > 0 ){
      			document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'; 

      		} else {
      			document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      		}

      	},

      	displayPercentages: function(percentages){
      		var fields;

      		//returns a node list.
      		fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      		//we call nodeList function with the callback function from the first function.
      		nodeListForEach(fields, function(current, index){
      			if(percentages[index] > 0){
      				current.textContent = percentages[index] + '%';
      			} else {
      				current.textContent = '---';
      			}
      		});
      	},
      	//date object constructor 
      	displayMonth: function(){
      		var now,months, year, month;
      		//returns the date of today.

      		now = new Date();

      		//returns the year and today's date.
      		year = now.getFullYear();

      		months = ['January', 'Feburary', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December'];
      		month = now.getMonth();

      		document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' +  year;

      	},

      	changedType: function(){
      		var fields;
      		//selecting the dom elements to change the color red when we add an expense. 
      		fields = document.querySelectorAll(
      		DOMstrings.inputType + ',' +
      		DOMstrings.inputDescription + ',' +
      		DOMstrings.inputValue
			);

      		//changes the color of the input when we switch between exp and inc 
      		nodeListForEach(fields, function(cur){
      			cur.classList.toggle('red-focus');
      		});

      		document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
      	},

			getDOMstrings: function(){
        	    return DOMstrings;
      	}
        


      };

})();

//we are using this 3rd controller as the connection between the previous two.
var controller = (function(budgetCtrl, UICtrl){//global app controller

		var setupEventListeners = function(){
			var DOM = UICtrl.getDOMstrings();
			  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
                //this happens on the global level to the window. checking to see if enter was pressed for entering data.
               document.addEventListener('keypress', function(e){
  			//which is for older browsers want to add in functionality for this.
  			if(e.keyCode === 13 || e.which === 13){
  			     ctrlAddItem();
  			}
        });
         //event listener to allow for removing of items from budget.
         document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

         document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);      

	};
		//this will do the mathematics involved.
	var updateBudget = function(){
		//1. calc the budget
		budgetCtrl.calculateBudget();
  		//2. return the budget. created a function to pass the information
  		var budget = budgetCtrl.getBudget();//the object that we create to display the budget.
  		//allows us to update the UI with our budget.
  		UICtrl.displayBudget(budget);
	}

	var updatePercentages = function(){
		var percentages;
		//1.calculate %
		budgetCtrl.calculatePercentages();
		//2. read % from budget controller
		percentages = budgetCtrl.getPercentages();
		//3. update UI with new %
		UICtrl.displayPercentages(percentages);
	}

		//allows us to not break dry.
	var ctrlAddItem = function(){//accounts for both hitting enter and clicking the button.
		var input, newItem;
		//1. get the input data
			input = UICtrl.getInput();

			//allows us to test the data that is being input to see if it's acceptable.
			if(input.description !== "" && !isNaN(input.value) && input.value > 0){
				//2. we need to add the item to the budget controller. Grabs the item from the ui and adds it
  				newItem = budgetController.addItem(input.type, input.description, input.value);

  			//3. Add the item to the UI
  				UICtrl.addListItem(newItem, input.type);
  			

  			//4. For clearing the fields.
  				UICtrl.clearFields();

  			//5. calculate and update budget

  				updateBudget();

  			//6. calculate and update percentages
  				updatePercentages();	
			}

  			
  			
  		};
  		//removes items from budget and UI
  		var ctrlDeleteItem = function(e){
  			var itemID, splitID, type, ID;
  			//allows us to hit the parentNode of the delete button for our budget items. 
  			itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

  			if(itemID){

  				//inc-1 this separates the values by the -
  				splitID = itemID.split('-');
  				//inc / exp is the first item of the resulting array
  				type = splitID[0];
  				//id is the second item in the resulting array. We need to convert from a string to a number.
  				ID = parseInt(splitID[1]);


  				//1. delete the item from data structure
  				budgetCtrl.deleteItem(type, ID);

  				//2. delete item from UI we use itemID to remove the entire budget.
  				UICtrl.deleteListItem(itemID);

  				//3. update and show new totals.
  				updateBudget();

  				//4. 
  				updatePercentages();

  			}
  		};



	//if we want something to be public we need to return as an object.
		return {
			init: function(){
				console.log('app has started');
				UICtrl.displayMonth();
				//this allows us to load the application with everything set to 0!
				UICtrl.displayBudget(
						{
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
				setupEventListeners();
			}
		};


//this calls the two previous functions and tests them.
})(budgetController, UIController);

//this is how we setup the event listeners at the very beginning that we want setup as soon as the page is loaded.
controller.init();
