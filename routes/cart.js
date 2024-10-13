const router = require("express").Router();
const Cart = require("../models/Cart");
//const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

//CREATE
router.post("/", async (req,res)=>{//, verifyToken

    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        return res.status(201).send(savedCart);
    }
    catch(error){
        return res.status(500).json(error);
    }
});

//UPDATE
router.put("/:id", async (req,res)=>{//, verifyTokenAndAuthorization
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            return res.status(200).json(updatedCart);
        }catch(error){
            return res.status(500).json(error);
        }
    }else{
        return res.status(404).json("Not Found");
    }
});

//GET ALL CARTS
router.get("/", async (req,res)=>{//
    try{
        const carts = await Cart.find();
        return res.status(200).json(carts);
    }catch(error){
        return res.status(500).json(error);        
    }
});

//GET BY ID?

//DELETE
router.delete("/:id", async (req,res)=>{//, verifyTokenAndAuthorization
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            await Cart.findByIdAndDelete(req.params.id);
            return res.status(204).json("Cart has been deleted");
        }catch(error){
            return res.status(500).json(error);        
        }
    }else{
        return res.status(404).json("Not Found");
    }
});

module.exports = router;