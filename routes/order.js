const router = require("express").Router();
const Order = require("../models/Order");
//const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

//CREATE
router.post("/", async (req,res)=>{//, verifyToken

    const newOrder = new Order(req.body);
    try{
        const savedOrder = await newOrder.save();
        return res.status(201).send(savedOrder);
    }
    catch(error){
        return res.status(500).json(error);
    }
});

//UPDATE
router.put("/:id", async (req,res)=>{//, verifyTokenAndAdmin
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            return res.status(200).json(updatedOrder);
        }catch(error){
            return res.status(500).json(error);
        }
    }else{
        return res.status(404).json("Not Found");
    }
});

//GET ALL ORDERS
router.get("/", async (req,res)=>{//, verifyTokenAndAdmin
    try{
        const orders = await Order.find();
        return res.status(200).json(orders);
    }catch(error){
        return res.status(500).json(error);        
    }
});

//DELETE
router.delete("/:id", async (req,res)=>{//, verifyTokenAndAdmin
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            await Order.findByIdAndDelete(req.params.id);
            return res.status(204).json("Order has been deleted");
        }catch(error){
            return res.status(500).json(error);        
        }
    }else{
        return res.status(404).json("Not Found");
    }
});

module.exports = router;