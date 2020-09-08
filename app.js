// Build a database for the warehouse

// Warehouse - name, address, capacity
// Create warehouses // http://localhost:8080/addwarehouse/WarehouseB/Sydney/450
// Get warehouses

// Items - name, sku, cost, quantity, warehouse stored at, created
// Create
// Read
// Update
// Delete


const mongoose = require("mongoose");
const express = require("express");
const app = express();

const Warehouse = require("./models/warehouse.js");
const Item = require("./models/item.js");

mongoose.connect("mongodb://localhost:27017/warehouseDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err) {
    if (err) {
      throw err;
    }

    console.log("Succesfully connected to the database.");
  }
);

// Create warehouses
app.get("/addwarehouse/:name/:address/:capacity", function (req, res) {

  const wH = new Warehouse({
    name: req.params.name,
    address: req.params.address,
    capacity: parseInt(req.params.capacity)
  });

  wH.save(function (err) {
    if (err) console.log("Unable to create warehouse.", err.message);

    res.redirect("/getwarehouses");
  });
});

// Get warehouses
app.get("/getwarehouses", function (req, res) {
  Warehouse.find(function (err, data) {
    data = JSON.stringify(data, null, 2);
    res.send("<pre>" + data + "</pre>");
  });
});

// Create item
// http://localhost:8080/additem/5f5717f6575b1a3090d055ab/TV/1234567890/50/100
// Items - name, sku, cost, quantity, warehouse stored at, created
app.get("/additem/:whId/:name/:sku/:cost/:quantity", function (req, res) {
  Item.create({
    name: req.params.name,
    sku: req.params.sku,
    cost: req.params.cost,
    quantity: req.params.quantity,
    warehouse: mongoose.Types.ObjectId(req.params.whId)
  }, function (err) {
    if (err) console.log("Unable to create document: ", err.message);

    res.redirect("/getitems");
  });
});

// Read items
app.get("/getitems", function (req, res) {
  Item.find().populate('warehouse').exec(function (err, data) {
    data = JSON.stringify(data, null, 2);
    res.send("<pre>" + data + "</pre>");
  });
});

// Update item
app.get("/updateItem/:sku/:newQty", function (req, res) {
  Item.updateOne(
    { 'sku': req.params.sku },
    { $set: { 'quantity': parseInt(req.params.newQty) } },
    function (err, data) {
      res.redirect("/getitems");
    }
  )
});

// Delete item
app.get("/deleteItem/:sku", function (req, res) {
  Item.findOneAndDelete(
    { 'sku': req.params.sku }, 
    function (err, data) {
      res.redirect("/getitems");
    });
});

app.listen(8080);