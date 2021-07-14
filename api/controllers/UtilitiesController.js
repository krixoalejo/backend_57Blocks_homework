/**
 * UtilitiesController
 *
 * @description :: Utility generic methods.
 */

const hex = 'hex';

module.exports = {
    decrypt: function(text) {
        let iv = Buffer.from(text.iv, hex);
        let encryptedText = Buffer.from(text.encryptedData, hex);
        let decipher = sails.crypto.createDecipheriv(sails.encrypt.algorithm, Buffer.from(sails.encrypt.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    encrypt: function(text) {
        let cipher = sails.crypto.createCipheriv(sails.encrypt.algorithm, Buffer.from(sails.encrypt.key), sails.encrypt.iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: sails.encrypt.iv.toString(hex), encryptedData: encrypted.toString(hex) };
    },
    getStatus: function (status) {
        // Possible states for records.
        if (status === 0) return 'Inactive'; 
        if (status === 1) return 'Active';
    },
    responseBack: function (status, message, res, data) {
        // Structure to the generic responses.
        if (data) return res.status(status).send({ 'status': status, 'message': message, 'data': data });
        return res.status(status).send({ 'status': status, 'message': message });
    }
};

