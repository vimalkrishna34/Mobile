const express=require('express');
const app=express();
const port=3009;
const mongoose=require('mongoose');
//database connection
async function databaseConnection(url){
    try{
         await mongoose.connect(url);
    }
    catch(err){
        console.log(err);
    }
}
databaseConnection('mongodb://localhost:27017/connect1');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//routes
const staticRoutes=require('./routes/staticRoutes');
app.use('/',staticRoutes);

app.listen(port,(err)=>{
   if(err)console.log(err);
   else console.log(`server running on port:${port}`);
});