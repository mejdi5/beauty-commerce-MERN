const router = require("express").Router();
const Order = require("../models/Order");
const { 
    isAuthenticated, 
    isAuthorized, 
    adminAuthorization
} = require('./middlewares')

//GET MONTHLY INCOME
router.get("/income", async (req, res) => {
    const productId = req.query.productId;
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
        {
            $match: {
            createdAt: { $gte: previousMonth },
            ...(productId && {products: { $elemMatch: { "product._id": productId} }}),
            },
        },
        {
            $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
            },
        },
        {
            $group: {
            _id: "$month",
            total: { $sum: "$sales" },
            },
        },
    ]);
        res.status(200).json(income);

    } catch (err) {
        console.log(err.message)
        res.status(500).json(err);
    }
});


//POST NEW ORDER
router.post("/", /*isAuthenticated,*/ async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//EDIT AN ORDER
router.put("/:orderId", /*adminAuthorization,*/ async (req, res) => {
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
router.delete("/:orderId", /*adminAuthorization,*/ async (req, res) => {
    try {
        await Order.findOneAndDelete({ _id: req.params.orderId });
        res.status(200).json("Order has been deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET USER ORDERS
router.get("/:userId", /*isAuthorized,*/ async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({createdAt: -1});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL ORDERS
router.get("/",/* adminAuthorization,*/ async (req, res) => {
    try {
        const orders = await Order.find().sort({createdAt: -1});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
