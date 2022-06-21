const router = require("express").Router();
const Cart = require("../models/Cart");
const { 
    isAuthenticated, 
    isAuthorized, 
    adminAuthorization
} = require('./middlewares')

const Product = require('../models/Product')

//POST NEW CART
router.post("/", /*isAuthenticated,*/ async (req, res) => {
    const { userId } = req.body
    const newCart = new Cart({userId});
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//EDIT CART
router.put("/:cartId", /*isAuthorized,*/ async (req, res) => {
    try {
    const editedCart = await Cart.findByIdAndUpdate(
        req.params.cartId,
        {$set: req.body},
        { new: true }
    );
    editedCart.cartProducts = req.body.cartProducts
    editedCart.quantity = req.body.cartProducts.length > 0 ? req.body.cartProducts.map(p => p.productQuantity).reduce((a,b) => a + b) : 0
    editedCart.total = req.body.cartProducts.length > 0 ? req.body.cartProducts.map(p => p.product.price*p.productQuantity).reduce((a,b) => a + b) : 0
    
    const updatedCart = await editedCart.save()

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error.message);
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

//GET CART of a user
router.get("/:userId", /*isAuthorized,*/ async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error);
    }
})

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
