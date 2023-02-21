const {db, ProductInfo} = require("../database/dbconn");
const {findUserbyUsername, findProduct,checkSkuUnique,updateProductData} = require ('../database/dataOperations');
const {
    basicAuth,
    comparePassword,
    isInt
} = require("../utils/helpers");


const updateProductAll = async (req,res) =>
{   //Change this to BasicAuth
    console.log("In updateProduct");
    const [username, password] = basicAuth(req);

    if (!username || !password) {
        return res.status(403).json("Invalid Authorization Details");
    }
    
    findUserbyUsername(username).then((foundUser)=> 
    // what to do if user not found?
    {   
        if(foundUser)
        { console.log("In foundUser");
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
                        console.log("IN comparevalue");
                        findProduct(product_id).then((foundProduct)=>
                        {
                            if(foundProduct)
                            { console.log("In foundProduct");
                                if(foundProduct.dataValues.owner_user_id == foundUser.dataValues.id)
                                {
                                    console.log("Inside foundProduct");
                                    const requiredFields = ["name","description","sku","manufacturer","quantity"];
                                    const requiredKeys = req.body? Object.keys (req.body) : null;

                                    if(!requiredKeys || !requiredKeys.length)
                                    {
                                        console.log(req.body);
                                        return res.status(400).json("Inappropriate Inputs");
                                    }

                                    let check = true;

                                    requiredKeys.forEach(val=>{
                                        if(requiredFields.indexOf(val)<0){
                                            check = false;
                                        }
                                    })

                                    if(!check)
                                    {
                                        return res.status(400).json("Allowed fields are only Product Name, Description, sku, manufacturer and quantity");
                                    }

                                    const {
                                        name,
                                        description,
                                        sku,
                                        manufacturer,
                                        quantity
                                    } = req.body;
                                //Checks for Nulls in fields - but are NULLs allowed anyway?
                                    if(!name || !description || !sku || !manufacturer || !quantity || !name.length || !description.length || !sku.length || !manufacturer.length)
                                    {
                                        return res.status(400).json("Use Patch request for updating only few fields");
                                    }
                                    if(quantity && (!(quantity>=0 && quantity<=100) || !(isInt(quantity))))
                                    {

                                        console.log("IN Quntity");
                                        
                                        return res.status(400).json("Quantity must be between 0 and 100");
                                    }
                                    if(sku)
                                    {
                                        console.log("In SKU");
                                        checkSkuUnique(sku,product_id).then((existingProduct)=>
                                        {
                                            if (existingProduct && existingProduct.dataValues.id != product_id) 
                                            {
                                                res.status(400).json("SKU must be unique")
                                            }
                                        
                                            else
                                            {
                                                console.log("Before update but with SKU");
                                                updateProductData(foundProduct,req).then((updatedProduct)=>
                                                {
                                                    console.log("Updated product")
                                                    console.log(updatedProduct);
                                                    if(updatedProduct)
                                                    {
                                                        res.status(204).json(updatedProduct);
                                                    }
                                                    else
                                                    {
                                                        res.status(400).json("Something unexpected happened");
                                                    }
                                                });

                                            }
                                        });
                                    }

                                    else
                                    {
                                        console.log("Before update but no SKU");
                                        updateProductData(foundProduct,req).then((updatedProduct)=>
                                        {
                                            console.log("Updated product")
                                            console.log(updatedProduct);
                                            if(updatedProduct)
                                            {
                                                res.status(204).json(updatedProduct);
                                            }
                                            else
                                            {
                                                res.status(400).json("Something unexpected happened");
                                            }
                                        });
                                    }
                                    
                                }
                                else
                                {
                                    res.status(403).json("Can only update products created by yourself");
                                }
                            }
                            else
                            {
                                res.status(404).json("Requested Product not found")
                            }
                        });
                    }
                    else
                    {
                        return res.status(401).json("Invalid Password");
                    }
                });
        }
        else
        {
            return res.status(403).json("Only authorized users can update products");
        }

    });
    
}

module.exports = updateProductAll;