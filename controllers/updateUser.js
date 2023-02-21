const {findUser,updateUserData} = require("../database/dataOperations");

const {
    basicAuth,
    comparePassword,
    hashPasswordGenerator,
    isInt
} = require("../utils/helpers");

const updateUser = (req, res) => 
{
    const [username, password] = basicAuth(req);

    if (!username || !password) 
    {
        return res.status(403).json("Invalid Authorization Details");
    }

    if(!isInt(req.params.userid))
    {
        res.status(400).json("Product ID must be an integer");
    }
    const urlid = req.params.userid;
    
    findUser(username,urlid).then((foundUser)=> // what to do if user not found?
    {   if(foundUser)
        {
            const hashPassword = foundUser["password"];
            comparePassword(password, hashPassword).then (compareValue => 
                {
                    if(compareValue)
                    {
                        updateData(req,res,username,foundUser);  
                    }
                    else
                    {
                        return res.status(401).json("Invalid Password");
                    }
                })
        }
        else
        {
            return res.status(401).json("Invalid Username and UserID");
        }

    })
}

const updateData = (req,res,username,foundUser) =>
{
    const requiredFields = ["first_name","last_name","password"];
    //Creating a list of keys from body of request to iterate through
    const requiredKeys = req.body? Object.keys (req.body) : null;

    if(!requiredKeys || !requiredKeys.length)
    {
        console.log(req.body);
        return res.status(400).json("No valid inputs to update");
    }

    let check = true;

    requiredKeys.forEach(val=>{
        if(requiredFields.indexOf(val)<0){
            check = false;
        }
    })

    if(!check)
    {
        return res.status(400).json("Only First Name, LastName and Password can be updated");
    }

    const {
        first_name,
        last_name,
        password
    } = req.body;



    if(password)
    {
        hashPasswordGenerator(password).then((hashPassword) => {
            req.body.password = hashPassword;
            updateDB(req,res,foundUser);
        })
    }
    else
    {
        updateDB(req,res,foundUser);
    }
}

const updateDB = (req,res,foundUser) =>
{
    updateUserData(foundUser,req).then((updatedUser)=>
    {
        return res.status(204).json(updatedUser);
    }).catch((error)=>
    {
        res.status(400).json(error);
    });
                
}


module.exports = updateUser;