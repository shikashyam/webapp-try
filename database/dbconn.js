require('dotenv').config();
const {Sequelize} = require ('sequelize');

const db = new Sequelize (process.env.DATABASE,process.env.DB_USER,process.env.DB_PASSWORD,{
    host : process.env.DB_HOST,
    dialect : 'postgres',
    pool : {
        max :5,
        min:0,
        acquire : 30000,
        idle: 10000
    }
});

const UserInfo = db.define ('userinfo',{
    id: {
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    first_name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    last_name:{
        type:Sequelize.STRING,
        allowNull:false
    },    
    username:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    account_created:{
        type:Sequelize.DATE,
        allowNull:false
    },
    account_modified:{
        type:Sequelize.DATE,
        allowNull:false
    }

},
{
    freezeTableName: true,
    timestamps : false
});

const ProductInfo = db.define ('productinfo',{
    id: {
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:true
    },
    description:{
        type:Sequelize.STRING,
        allowNull:true
    },    
    sku:{
        type:Sequelize.STRING,
        allowNull:true
    },
    manufacturer:{
        type:Sequelize.STRING,
        allowNull:true
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    date_added:{
        type:Sequelize.DATE,
        allowNull:false
    },
    date_last_updated:{
        type:Sequelize.DATE,
        allowNull:false
    },
    owner_user_id:{
        type:Sequelize.INTEGER,
        allowNull:false
    }

},
{
    freezeTableName: true,
    timestamps : false
});


module.exports = {db,UserInfo,ProductInfo};