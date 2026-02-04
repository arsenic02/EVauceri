const jwt = require('jsonwebtoken')
const Gost = require('../models/GostModel')

const requireAuth = async (req, res, next) => {

    //verifikacija autentikacije
   const {authorization} =  req.headers

   if(!authorization) {
    return res.status(401).json({error: 'Neophodan je token za autorizaciju'})
   }
//bearer token asdksadskdja.sadjkashdjkd.asdjksad  ima u postmanu taj bearer token u authorization
   const token = authorization.split(' ')[1]

   try {
    const {_id} =  jwt.verify(token, process.env.SECRET) //meni se  ne nudi SECRET ovde
    req.gost= await Gost.findOne({_id}).select('_id')  //req.gost , ovo gost moze da se nazove bilo kako
    next()
   }
   catch(error)
   {
        console.log(error)
        res.status(401).json({error: 'Zahtev nije autorizovan'})
   }

}

module.exports = requireAuth