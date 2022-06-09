//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true});

const itemSchema = {
  name: String
}

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo list"
})

const item2 = new Item({
  name: "Welcome to your todo list"
})

const item3 = new Item({
  name: "Welcome to your todo list"
})

const defaultItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    if (foundItems.length ===0 ) {
      Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully added default items.");
      }
      });
      
      res.redirect("/")

    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});

    }
  })

  
});

app.post("/", function(req, res){

  

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })

  item.save()

  res.redirect("/")

});

app.post("/remove", function(req,res){
  checkeditemid = req.body.checkbox
  Item.findByIdAndRemove(checkeditemid, function(err){
    if (err){
      console.log(err);
    }
    else {
      console.log("Item with Id = " + String(checkeditemid) + " is removed successfully");
    }
    res.redirect("/")
  })
})

app.get("/:customListName", function(req, res){
  customListName = req.params.customListName;

  const list = new List({
    name: customListName,
    items: defaultItems
  })

  list.save()

})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
