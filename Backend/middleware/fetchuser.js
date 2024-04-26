const jwt = require('jsonwebtoken');
const JWT_SECRET = "Devarshisagoodb$y";
const fetchuser = (req,res,next) =>
{
    // Get the User from the jwt token and add id to require object.
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({error: 'Please Authenticate using a valid Token.'})
    }
    const data = jwt.verify(token,JWT_SECRET);
    try {
      
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: 'Please Authenticate using a valid Token.'})
    }
   
}
module.exports = fetchuser;