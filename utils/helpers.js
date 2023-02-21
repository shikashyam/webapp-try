const bcrypt = require ("bcrypt");

const basicAuth = (req) => {
    const auth = req.headers.authorization;
    //console.log(auth);
    if (!auth || auth.indexOf('Basic ') === -1) 
    return [null,null];
    // verify auth credentials
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    //console.log(credentials);
    return credentials.split(':');
}

const hashPasswordGenerator = async (password) =>
{   const saltRounds = 10;
    try
    {
        const salt =  await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password,salt);
    } 
    catch(error) 
    {
        console.log("Error in password hashing");
        console.log(error);
    }
}

const comparePassword = async (password, hashPassword)=>
{
    return await bcrypt.compare(password, hashPassword);
}

const emailValidator = (email) =>
{
    const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailFormat.test(email);
}

const isInt = (value) =>
 {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
  }

module.exports = {
    basicAuth,
    hashPasswordGenerator,
    comparePassword,
    emailValidator,
    isInt
};