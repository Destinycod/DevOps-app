const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/register", async (req,res)=>{
    const newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    while(req.body.username === "" || req.body.email === "" || req.body.password === ""){
        return res.status(400).json("Bad request. Some fields are empty");
    }
    
    try{
        await newUser.save();
        res.status(201).send(req.body);
    }
    catch(error){
        res.status(500).json(error);
    }
    
});

router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        while(!user){
            return res.status(401).json("Wrong username");
        }

        const userPassword = user.password;
        while(userPassword !== req.body.password){
            return res.status(401).json("Wrong password");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            {expiresIn: "3d"}
        );

        const { password, ...others } = user._doc;
        res.status(200).json({...others, accessToken});
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
});


module.exports = router;

//guardo el usuario, pero como puede demorar bastante lo hago asincronico
