//anonymous function wrapped in () is a module
//a module is equated to a chapter in a book that allows the code to be maintained. 
//in javascript what is inside of a () can't be a statement
//budget controller
var budgetController = (function(){
	//some code
	

})();
//these two other controllers don't know each other exist.
var UIController = (function(){//ui controller
      
      var DOMstrings = {
      		inputType: '.add__type',
      		inputDescription: '.add__description',
      		inputValue: '.add__value',
      		inputBtn: '.add__btn'
      };

      return {
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

	var DOM = UICtrl.getDOMstrings();

//allows us to not break dry.
	var ctrlAddItem = function(){//accounts for both hitting enter and clicking the button.
		//1. get the input data
			var input = UICtrl.getInput();

			console.log(input);
  			//2. we need to add the item to the budget controller.

  			//3. Add the item to the UI

  			//4. calc the budget

  			//5. display the budget.
  		

	}
  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
//this happens on the global level to the window. checking to see if enter was pressed for entering data.
  document.addEventListener('keypress', function(e){
  			//which is for older browsers want to add in functionality for this.
  			if(e.keyCode === 13 || e.which === 13){
  			     ctrlAddItem();
  			}
  });

//this calls the two previous functions and tests them.
})(budgetController, UIController);
