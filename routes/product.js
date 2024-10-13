const router = require("express").Router();
const Product = require("../models/Products");
const {verifyTokenAndAdmin} = require("./verifyToken");

//CREATE
router.post("/", async (req,res)=>{//, verifyTokenAndAdmin

    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        return res.status(201).send(savedProduct);
    }
    catch(error){
        return res.status(500).json(error);
    }
});

//UPDATE
router.put("/:id", async (req,res)=>{//, verifyTokenAndAdmin

    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            return res.status(200).json(updatedProduct);
        }catch(error){
            return res.status(500).json(error);
        }
    }else{
        return res.status(404).json("Not Found");
    }

});

//DELETE
router.delete("/:id", async (req,res)=>{//, verifyTokenAndAdmin
    
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            await Product.findByIdAndDelete(req.params.id);
            return res.status(204).json("Product has been deleted");
        }catch(error){
            return res.status(500).json(error);        
        }
    }else{
        return res.status(404).json("Not Found");
    }
});

//GET BY ID
router.get("/:id", async (req,res)=>{

    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        try{
            const product = await Product.findById(req.params.id);
            return res.status(200).json(product);
        }catch(error){
            return res.status(500).json(error);        
        }
    }else{
        return res.status(404).json("Not Found");
    }
});

//GET ALL
router.get("/", async (req,res)=>{
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try{
        let products;

        if(queryNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if(queryCategory){
            products = await Product.find({categories: {
                $in: [queryCategory]
            }});
        } else{
            products = await Product.find();
        }
        
        return res.status(200).send(products);
    }catch(error){
        return res.status(500).json(error);        
    }
});

module.exports = router;