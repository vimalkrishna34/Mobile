const mongoose=require('mongoose');

const mobileSchema=new mongoose.Schema({
    name:{type:String,required:true},
    brand:{type:String,required:true},
    prise:{type:String,required:true},
});

const mobile=mongoose.model('mobile',mobileSchema);

module.exports=mobile;