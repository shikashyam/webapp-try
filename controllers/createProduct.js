
const {db, ProductInfo} = require("../database/dbconn");
const {createProductData, checkSkuUnique, findUserbyUsername} = require ('../database/dataOperations');
const {
    basicAuth,
    comparePassword,
    isInt
} = require("../utils/helpers");


const createProduct = async (req,res) =>
{   //Change this to BasicAuth
    const [username, password] = basicAuth(req);

    if (!username || !password) {
        return res.status(403).json("Invalid Authorization Details");
    }
    
    findUserbyUsername(username).then((foundUser)=> 
    // what to do if user not found?
    {   console.log("User Found?")
        console.log(foundUser);
        if(foundUser)
        {
            const hashPassword = foundUser["password"];
            comparePassword(password, hashPassword).then (compareValue => 
                {
                    if(compareValue){
                        //Authorized.
                        const owner_user_id = foundUser.dataValues.id;
                        const requiredFields = ["name","description","sku","manufacturer","quantity","date_added","date_last_updated","owner_user_id"];
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
                            return res.status(400).json("Required fields are only Product Name, Description, sku, manufacturer and quantity");
                        }

                        const {
                            name,
                            description,
                            sku,
                            manufacturer,
                            quantity
                        } = req.body;
                    //Checks for Nulls in fields - but are NULLs allowed anyway?
                        if(!name || !description || !sku || !manufacturer || !quantity || !name.length || !description.length)
                        {
                            return res.status(400).json("Input data is insufficient");
                        }


                        if(!(isInt(quantity))||!(quantity>=0 && quantity<=100))
                        {
                            return res.status(400).json("Quantity must be a number between 0 and 100");
                        }
                        
                        checkSkuUnique(sku).then((existingProduct)=>
                            {
                                if (existingProduct) 
                                {
                                    return res.status(400).json("Sku must be unique");
                                } 
                                else 
                                {
                                    let newProduct = req.body;
                                    newProduct["owner_user_id"] = owner_user_id;
                                    newProduct["date_added"] = new Date().toISOString();
                                    newProduct["date_last_updated"] = new Date().toISOString();
                                    
                                    createProductData(newProduct).then((newProduct) => 
                                    {
                                        res.status(201).send(newProduct);
                                    }).catch((error) => 
                                    {
                                        res.status(400).json(error);
                                    });

                                }        
                            });
                    }
                    else{
                        return res.status(401).json("Invalid Password");
                    }
                })
        }
        else
        {
            return res.status(403).json("Only authorized users can create new products");
        }

    });
    


}


module.exports = createProduct;