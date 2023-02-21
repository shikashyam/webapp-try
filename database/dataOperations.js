const {db, UserInfo,ProductInfo} = require('./dbconn');
const {isInt} = require("../utils/helpers")
//Functions for CRUD on UserInfo
function createUserData (user){
    var newUser = new UserInfo(user);
    return newUser.save();
}

async function checkUsernameUnique  (username)
{
    const foundUser = await UserInfo.findOne({ where: { username: username } });
    return foundUser;
}

async function findUser  (username,id)
{
    const foundUser = await UserInfo.findOne({ where: { username: username, id:id } });
    return foundUser;
}

async function findUserbyUsername  (username)
{
    const foundUser = await UserInfo.findOne({ where: { username:username } });
    return foundUser;
}

async function updateUserData(foundUser,req)
{
    if(req.body.first_name)
    {
        foundUser.first_name = req.body.first_name;
    }
    if(req.body.last_name)
    {
        foundUser.last_name = req.body.last_name;
    }
    if(req.body.password)
    {
        foundUser.password = req.body.password;
    }

    const account_modified = new Date().toISOString();
    foundUser.setDataValue('account_modified', account_modified);
    foundUser.save();
    return foundUser;
}

//Functions for CRUD on ProductData
function createProductData (product){
    var newProduct = new ProductInfo(product);
    return newProduct.save();
}

async function checkSkuUnique  (sku)
{
    const foundProduct = await ProductInfo.findOne({ where: { sku: sku } });
    return foundProduct;
}

async function checkUpdateSkuUnique  (sku,product_id)
{
    const foundProduct = await ProductInfo.findOne({ where: { sku: sku, id : {
        [sequelize.Op.not]: product_id
      } } });
    return foundProduct;
}

async function findProduct  (id)
{
    const foundProduct = await ProductInfo.findOne({ where: { id:id } });
    return foundProduct;
}

async function updateProductData(foundProduct,req)
{
    if(req.body.name)
    {
        foundProduct.name = req.body.name;
    }
    if(req.body.description)
    {
        foundProduct.description = req.body.description;
    }
    if(req.body.sku)
    {
        foundProduct.sku = req.body.sku;
    }
    if(req.body.manufacturer)
    {
        foundProduct.manufacturer = req.body.manufacturer;
    }
    if(req.body.quantity && req.body.quantity>=0 && req.body.quantity<=100 && isInt(req.body.quantity))
    {
        foundProduct.quantity = req.body.quantity;
    }
    const date_last_updated = new Date().toISOString();
    foundProduct.setDataValue('date_last_updated', date_last_updated);
    foundProduct.save();
    return foundProduct;
}

async function deleteProductById(id) {
    return ProductInfo.destroy({ where: { id: id } });
}

module.exports = {createUserData, checkUsernameUnique,findUser,findUserbyUsername, 
                    updateUserData,createProductData,checkSkuUnique,findProduct,
                    updateProductData,deleteProductById,checkUpdateSkuUnique};