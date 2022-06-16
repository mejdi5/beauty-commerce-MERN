const router = require("express").Router();
const Cart = require("../models/Cart");
const { 
    isAuthenticated, 
    isAuthorized, 
    adminAuthorization
} = require('./middlewares')

//POST NEW CART
router.post("/", isAuthenticated, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//EDIT CART
router.put("/:cartId", isAuthorized, async (req, res) => {
    try {
    const editedCart = await Cart.findByIdAndUpdate(
        req.params.cartId,
        {$set: req.body},
        { new: true }
    );
        res.status(200).json(editedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//DELETE CART
router.delete("/:cartId", isAuthorized, async (req, res) => {
    try {
    await Cart.findByIdAndDelete({_id: req.params.cartId});
        res.status(200).json("Cart has been deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL CARTS
router.get("/", adminAuthorization, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
