//MY sql password in a separate key file
var key = require('./keys.js');
//node modules
var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: key,
    database: "Bamazon"
});

//connect to mysql database and run the managerPrompt function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    managerPrompt();
});

//prompt the user to select what they would like to do and run a function accordingly
function managerPrompt(){
  inquirer.prompt([
    {
    name: 'choice',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View Products For Sale', 'View Low Inventory', 'Add To Inventory', 'Add New Product', 'Exit']
    }
  ]).then(function(user){
    console.log(user.choice);
    switch(user.choice) {
          case 'View Products For Sale':
              viewProductsForSale(function(){
                managerPrompt();
              });
          break;

          case 'View Low Inventory':
              viewLowInventory(function(){
                managerPrompt();
              });
          break;

          case 'Add To Inventory':
              addToInventory();
          break;

          case 'Add New Product':
              addNewProduct();
          break;

          case 'Exit':
              connection.end();
          break;
      }
    });
}

//function to print all items to the console, uses npm module cli-table
function viewProductsForSale(cb){
  //new cli-table
  var table = new Table({
    head: ['ID Number', 'Product', 'Department', 'Price', 'Quantity Available']
  });
  //get all rows from the Products table
  connection.query('SELECT * FROM Products', function(err, res){
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, '$' + res[i].Price.toFixed(2), res[i].StockQuantity]);
    }
    //log the table to the console
    console.log(table.toString());
    //callback the managerPrompt function to see if the user wants to do anything else
    cb();
    });
}

//function to view all items where StockQuantity is less than 5
function viewLowInventory(cb){
  //query mysql database to get all rows where StockQuantity is less than 5
  connection.query('SELECT * FROM Products WHERE StockQuantity < 5',
  function(err, res){
    if(err) throw err;
    //if no items StockQuantity is less than 5 alert the user and run the callback function
    if (res.length === 0) {
      console.log('There are no items with low inventory.');
      //callback the managerPrompt function to see if the user wants to do anything else
      cb();
    } else {
      //if some items do have StockQuantity less than 5 create a table to show those items
      var table = new Table({
        head: ['ID Number', 'Product', 'Department', 'Price', 'Quantity Available']
      });
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, '$' + res[i].Price.toFixed(2), res[i].StockQuantity]);
      }
      //log the table to the console
      console.log(table.toString());
      console.log('These items are low on inventory.');
      //callback the managerPrompt function to see if the user wants to do anything else
      cb();
    }
  });
}

//function to add more inventory to items
function addToInventory(){
  var items = [];
  //query mysql database to get all ProductNames
  connection.query('SELECT ProductName FROM Products', function(err, res){
    if (err) throw err;
    //push all the product names to the items array
    for (var i = 0; i < res.length; i++) {
      items.push(res[i].ProductName)
    }
    //ask the user which items from the items array they would like tp update inventory for
    inquirer.prompt([
      {
      name: 'choices',
      type: 'checkbox',
      message: 'Which products would you to add inventory for?',
      choices: items
      }
    ]).then(function(user){
      //if the user doesn't select anything run the managerPrompt again to ask what they would like to do
        if (user.choices.length === 0) {
          console.log('Oops! You didn\'t select anything!');
          managerPrompt();
        } else {
          //run the howMuchInventory function with the users choices as an argument
          howMuchInventory(user.choices);
        }
      });
  });
}

//function to ask the user how much of each item to add to StockQuantity
//expects an array of item names (to edit quantity of) as an argument
function howMuchInventory(itemNames){
  //set the item to the first element of the array and remove that element from the array
  var item = itemNames.shift();
  var itemStock;
  //query mysql to get the current stock quantity of the selected item
  connection.query('SELECT StockQuantity FROM Products WHERE ?', {
    ProductName: item
  }, function(err, res){
    if(err) throw err;
    itemStock = res[0].StockQuantity;
    itemStock = parseInt(itemStock)
  });
  //ask the user how many of the selected item to add to StockQuantity
  inquirer.prompt([
    {
    name: 'amount',
    type: 'text',
    message: 'How many ' + item + ' would you like to add?',
    //validate that the input is a number
    validate: function(str){
        if (isNaN(parseInt(str))) {
          console.log('\nOops. That\'s not a valid number!');
          return false;
        } else {
          return true;
        }
      }
    }
  ]).then(function(user){
    var amount = user.amount
    amount = parseInt(amount);
    //update the mysql database to reflect the new StockQuantity of the item
    connection.query('UPDATE Products SET ? WHERE ?', [
    {
      StockQuantity: itemStock += amount
    },
    {
      ProductName: item
    }], function(err){
      if(err) throw err;
    });
    //if there are still items in the itemNames array run the howMuchInventory function again
    if (itemNames.length != 0) {
        howMuchInventory(itemNames);
      } else {
        //if there are no more items to be updated run the managerPrompt function again
        console.log('Inventory has been updated.');
        managerPrompt();
      }
    });
}

//function to add a new product to the Products table
function addNewProduct(){
  var departments = [];
  //get all of the department names from Departments table
  connection.query('SELECT DepartmentName FROM Departments', function(err, res){
    if(err) throw err;
    for (var i = 0; i < res.length; i++) {
      departments.push(res[i].DepartmentName);
    }
  });
  //prompt the user for all of the information needed for the new product
  inquirer.prompt([
    {
    name: 'item',
    type: 'text',
    message: 'What is the product name of the item you would like to add?'
    },
    {
    name: 'department',
    type: 'list',
    message: 'Which department does this item belong to? If you need to add a department you will need an executive to do that.',
    choices: departments
    },
    {
    name: 'price',
    type: 'text',
    message: 'What is the price of this item?'
    },
    {
    name: 'stock',
    type: 'text',
    message: 'How many of this item do we have in stock currently?'
    }
  ]).then(function(user){
      //create an object with all of the items properties
      var item = {
        ProductName: user.item,
        DepartmentName: user.department,
        Price: user.price,
        StockQuantity: user.stock
      }
      //inset the new item into the mysql database
      connection.query('INSERT INTO Products SET ?', item,
      function(err){
        if(err) throw err;
        console.log(item.ProductName + ' has been successfully added to the inventory.');
        //run managerPrompt function again to see what the user would like to do
        managerPrompt();
      });
    });
}
