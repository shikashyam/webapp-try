const { findProduct } = require("../database/dataOperations");
const { isInt } = require("../utils/helpers");


const retrieveProduct = async (req,res)=>
{   if(!isInt(req.params.product_id))
    {
        res.status(400).json("Product ID should be an integer");
    }
    const product_id = req.params.product_id;
    findProduct(product_id).then((foundProduct)=>
    {
        if(foundProduct)
        {
            res.status(200).json(foundProduct);
        }
        else
        {
            res.status(404).json("Requested product does not exist");
        }
    });
}

module.exports = retrieveProduct;