const router = require("express").Router();
const User = require("../models/User");
/*const { 
    isAuthorized, 
    adminAuthorization
} = require('./middlewares')*/


//GET USERS STATISTICS
router.get("/stats", /*adminAuthorization,*/ async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const usersStats = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
            $project: {
            month: { $month: "$createdAt" },
            },
        },
        {
            $group: {
            _id: "$month",
            total: { $sum: 1 },
            },
        },
        ]);
        res.status(200).json(usersStats)
    } catch (error) {
    res.status(500).json(error);
    }
});


//EDIT USER
router.put('/:userId', /*isAuthorized,*/ async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET
        ).toString();
    }
    try {
        const editedUser = await User.findOneAndUpdate(
            req.params.userId, 
            {$set: req.body}, 
            { new: true }
        )
        res.status(200).json(editedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

//DELETE USER
router.delete("/:userId", /*isAuthorized,*/ async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({_id: req.params.userId});
            res.status(200).json({msg:"User has been deleted...", deletedUser});
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ONE USER
router.get("/:userId", /*adminAuthorization,*/ async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId});
        const { password, ...otherProperties } = user._doc;
        res.status(200).json(otherProperties);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL USERS
router.get("/", /*adminAuthorization,*/ async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;
