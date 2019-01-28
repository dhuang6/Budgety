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
	};
	//same as expense
	var Income = function(id, description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

  	
   //data structure to hold our expenses and income.
	var data = {
		allItems : {
			exp: [],
			inc: []
		},
		totals : {
			exp: 0,
			inc: 0
		}
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
      		inputBtn: '.add__btn'
      };

      return {//holds the value of the exp / inc item within the object.
      	getInput : function(){

      		return {
      				type : document.querySelector(DOMstrings.inputType).value, //will be either income / expense
      			description : document.querySelector(DOMstrings.inputDescription).value,
      			value : document.querySelector(DOMstrings.inputValue).value

      		}
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
	};

		//allows us to not break dry.
	var ctrlAddItem = function(){//accounts for both hitting enter and clicking the button.
		var input, newItem;
		//1. get the input data
			input = UICtrl.getInput();

  			//2. we need to add the item to the budget controller. Grabs the item from the ui and adds it
  			newItem = budgetController.addItem(input.type, input.description, input.value);

  			//3. Add the item to the UI

  			//4. calc the budget

  			//5. display the budget.
  		};
	//if we want something to be public we need to return as an object.
		return {
			init: function(){
				console.log('app has started');
				setupEventListeners();
			}
		};


//this calls the two previous functions and tests them.
})(budgetController, UIController);

//this is how we setup the event listeners at the very beginning that we want setup as soon as the page is loaded.
controller.init();
