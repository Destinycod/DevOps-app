const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
//const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

//UPDATE
router.put("/:id", async (req,res)=>{ //, verifyTokenAndAuthorization

    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            return res.status(200).json(updatedUser);
        }catch(error){
            return res.status(500).json("error: " + error);
        }
    } else{
        return res.status(404).json("Not Found");
    }

});

//DELETE
router.delete("/:id", async (req,res)=>{//, verifyTokenAndAuthorization

    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){ 
        try{
            await User.findByIdAndDelete(req.params.id);
            return res.status(204).json("User has been deleted");
        }catch(error){
            return res.status(500).json(error);        
        }
    } else{
        return res.status(404).json("Not Found");
    }

});

//GET BY ID
router.get("/:id", async (req,res)=>{//, verifyTokenAndAdmin

    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){ 
        try{
            const user = await User.findById(req.params.id);
            const { password, ...others } = user._doc;
            return res.status(200).json(others);
        }catch(error){
            return res.status(500).json(error);        
        }
    } else{
        return res.status(404).json("Not Found");
    }

});

//GET ALL
router.get("/", async (req,res)=>{// , verifyTokenAndAdmin
    try{
        const users = await User.find();
        return res.status(200).json(users);
    }catch(error){
        return res.status(500).json(error);        
    }
});

//GET ORDERS OF ONE USER
router.get("/:userId/orders", async (req,res)=>{//, verifyTokenAndAuthorization
    if(req.params.userId.match(/^[0-9a-fA-F]{24}$/)){ 
        try{
            const orders = await Order.find({userId: req.params.userId});
            return res.status(200).json(orders);
        }catch(error){
            return res.status(500).json(error);        
        }
    } else{
        return res.status(404).json("Not Found");
    }
});

//GET USER CART BY ID
router.get("/:userId/carts", async (req,res)=>{//, verifyTokenAndAuthorization
    if(req.params.userId.match(/^[0-9a-fA-F]{24}$/)){ 
        try{
            const cart = await Cart.findOne({userId: req.params.userId});
            return res.status(200).json(cart);
        }catch(error){
            return res.status(500).json(error);        
        }
    }else{
        return res.status(404).json("Not Found");
    }
});

module.exports = router;