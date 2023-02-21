
const {db, UserInfo} = require("../database/dbconn");
const {createUserData, checkUsernameUnique} = require ('../database/dataOperations');


const { hashPasswordGenerator, emailValidator }= require("../utils/helpers");
;
const createUser = async (req,res) =>{
    
    const requiredFields = ["first_name","last_name","username","password","account_created","account_updated"];
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
        return res.status(400).json("Required fields are only First Name, LastName, Username and Password");
    }

    const {
        first_name,
        last_name,
        username,
        password
    } = req.body;

    if(!first_name || !last_name || !username || !password || !first_name.length || !last_name.length)
    {
        return res.status(400).json("Input data is insufficient");
    }

    const isValidEmail = emailValidator(username);
    if(!isValidEmail)
    {
        return res.status(400).json("Username/Email Address not in acceptable format");
    }
    hashPasswordGenerator(password).then((hashPassword)=>{
        checkUsernameUnique(username).then((existingUser)=>
        {
            if (existingUser) 
            {
                //console.log(existingUser["password"]);
                return res.status(400).json("Username must be unique");
            } 
            else 
            {
                let newUser = req.body;
                newUser["password"] = hashPassword;
                newUser["account_created"] = new Date().toISOString();
                newUser["account_modified"] = new Date().toISOString();
                
                createUserData(newUser).then((newUser) => 
                {
                    delete newUser.dataValues.password;
                    res.status(201).send(newUser);
                }).catch((error) => 
                {
                    res.status(400).json(error);
                });

            }        
        });
    });

}


module.exports = createUser;