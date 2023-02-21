const {db, ProductInfo} = require("../database/dbconn");
const {createProductData, deleteProductById, findUserbyUsername, findProduct} = require ('../database/dataOperations');
const {
    basicAuth,
    comparePassword,
    isInt
} = require("../utils/helpers");


const deleteProduct = async (req,res) =>
{   //Change this to BasicAuth
    const [username, password] = basicAuth(req);

    if (!username || !password) {
        return res.status(403).json("Invalid Authorization Details");
    }
    
    findUserbyUsername(username).then((foundUser)=> 
    // what to do if user not found?
    {   
        if(foundUser)
        {
            const hashPassword = foundUser["password"];
            comparePassword(password, hashPassword).then (compareValue => 
                {
                    if(compareValue){
                        //Authorized.
                        if(!isInt(req.params.product_id))
                        {
                            res.status(400).json("Product ID must be an integer");
                        }
                        const product_id = req.params.product_id;
                        //Check if product is found

                        findProduct(product_id).then((foundProduct)=>
                        {
                            if(foundProduct)
                            {
                                if(foundProduct.dataValues.owner_user_id == foundUser.dataValues.id)
                                {
                                    deleteProductById(product_id).then((deletedProduct)=>
                                    {
                                        console.log("deleted product")
                                        console.log(deletedProduct);
                                        if(deletedProduct)
                                        {
                                            res.status(204).json("Deleted Product");
                                        }
                                        else
                                        {
                                            res.status(400).json("Something unexpected happened");
                                        }
                                    });
                                }
                                else
                                {
                                    res.status(403).json("Can only delete products created by yourself");
                                }
                            }
                            else
                            {
                                res.status(404).json("Requested Product not found")
                            }
                        });
                                            }
                    else{
                        return res.status(401).json("Invalid Password");
                    }
                });
        }
        else
        {
            return res.status(403).json("Only authorized users can delete products");
        }

    });
    


}


module.exports = deleteProduct;