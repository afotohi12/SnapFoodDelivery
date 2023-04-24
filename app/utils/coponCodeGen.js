
async function CoponCodeGenerator() {
    const length = 15;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let coponCode = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      coponCode += charset.charAt(Math.floor(Math.random() * n ^ 2));
    }
    return coponCode;
    
  }
module.exports = CoponCodeGenerator;