const jwt = require("jsonwebtoken");

// get user id from token
function getUserIdFromToken(token){
    if (!token) {
      return null
    }
     // Remove leading and trailing spaces
     const trimmedToken = token.trim();
  
     // Check for the "Bearer " prefix and remove it
     const tokenParts = trimmedToken.split(' ');
   
     if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
       const tokenValue = tokenParts[1];
   
       try {
         const decoded = jwt.verify(tokenValue, 'ewm8434');
         return decoded.userId;
       } catch (error) {
         console.error(error);
         return null; 
       }
     }
   
     return null; 
   
  }

  module.exports = {getUserIdFromToken}