// decrypt.js

const CryptoJS = require('crypto-js');

// Replace with your own secret key
const SECRET_KEY = 'feebank_pcte5824586';

const decrypt = (cipher) => {
    return CryptoJS.AES.decrypt(cipher, SECRET_KEY).toString(CryptoJS.enc.Utf8);
};

module.exports = { decrypt };

// Example usage
// const { decryptUserData } = require('./decrypt');
// const decrypted = decryptUserData({ username: 'encrypted_value', email: 'encrypted_value', password: 'encrypted_value', option: 'encrypted_value' });
// console.log(decrypted);