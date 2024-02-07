const auth= require('basic-auth');
// const Partner = require("../models/partner");

const basicAuth =async (req, res, next ) => {
    // console.log('middleware');
  res.removeHeader("x-powered-by");
  res.removeHeader("set-cookie");
  res.removeHeader("Connection");
    const user= await auth(req);
//    console.log(req);
    if(user){
        // let data=await Partner.findOne({
   
        //     where: {
        //       name: user.name.toLowerCase(),
        //       password: user.pass
        //     }      
        // });
        if(user.name.toLowerCase() == "redwan" && user.pass == "12345678"){
            // res.locals.userName = user.name.toLowerCase();
            // req.ame = user.name.toLowerCase();
            next();
        }else{
            res.status(401).json({
                "statusInfo": {
                  "message": "Incorrect Username or Password."
                  }
                  
              });
        }
        
    }else{
        res.status(401).json({
            "statusInfo": {
              "message": "Access Denied"
              }
              
          });
    }
    
}

module.exports= basicAuth;