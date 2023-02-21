require('dotenv').config();
const webapp = require("./api");
const { db } = require('./database/dbconn');

db.authenticate().then(() => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Error: ' + err);
})

const PORT = process.env.PORT;
//{force:true} Add this if dropping all tables is required
db.sync().then(() => {
    webapp.listen(PORT, console.log(`Server started on port ${PORT}`));
}).catch(err => console.log("Error: " + err));

