const router = require("express").Router();
const Order = require("../models/Order");
const { 
    isAuthenticated, 
    isAuthorized, 
    adminAuthorization
} = require('./middlewares')


//POST NEW ORDER
router.post("/", isAuthenticated, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//EDIT AN ORDER
router.put("/:orderId", adminAuthorization, async (req, res) => {
    try {
    const editedOrder = await Order.findOneAndUpdate(
        req.params.orderId,
        {$set: req.body},
        { new: true }
    );
        res.status(200).json(editedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//DELETE
router.delete("/:orderId", adminAuthorization, async (req, res) => {
    try {
        await Order.findOneAndDelete({ _id: req.params.orderId });
        res.status(200).json("Order has been deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET USER ORDERS
router.get("/:userId", isAuthorized, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({createdAt: -1});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL ORDERS
router.get("/", adminAuthorization, async (req, res) => {
    try {
        const orders = await Order.find().sort({createdAt: -1});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
