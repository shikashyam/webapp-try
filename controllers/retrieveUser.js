const {findUser} =  require ("../database/dataOperations");

const {
    basicAuth,
    comparePassword,
    isInt
} = require("../utils/helpers");


const retrieveUser = (req, res) => 
{
    const [username, password] = basicAuth(req);

    if (!username || !password) {
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
                    if(compareValue){
                        delete foundUser.dataValues.password;
                        const data = foundUser;
                        return res.status(200).json(data);
                        
                    }
                    else{
                        return res.status(401).json("Invalid Password");
                    }
                })
        }
        else
        {
            return res.status(401).json("Invalid Username and UserID");
        }

    });
        
}

module.exports = retrieveUser;