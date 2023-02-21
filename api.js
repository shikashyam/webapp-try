const express = require('express');
const app = express();

const {
    createUser,
    retrieveUser,
    updateUser,
    createProduct,
    deleteProduct,
    retrieveProduct,
    updateProduct,
    updateProductAll
} = require ("./controllers");

const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

//Routes

app.post("/v1/user",createUser);
app.get("/v1/user/:userid", retrieveUser);
app.put("/v1/user/:userid",updateUser);
app.post("/v1/product",createProduct);
app.delete("/v1/product/:product_id",deleteProduct);
app.get("/v1/product/:product_id",retrieveProduct);
app.patch("/v1/product/:product_id",updateProduct);
app.put("/v1/product/:product_id",updateProductAll);
app.get("/healthz", (req, res) => {
    try {
        res.status(200).json("Server is up and running")
    } catch (err) {
        res.json(err.message);
    }
});

app.use((req,res,next)=>
{
    res.status(404).send("Oops! Page not found")
});

module.exports = app;