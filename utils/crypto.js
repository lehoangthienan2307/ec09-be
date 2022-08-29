import CryptoJS from 'crypto-js'



const createHmacString = (message, key) => {
    const keyByte = CryptoJS.enc.Utf8.parse(key)
    const messageByte = CryptoJS.enc.Utf8.parse(message)
    const signature = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA256(messageByte, keyByte)
    )
    return signature
}


const encryptBase64 = (message) => {
    const wordArray = CryptoJS.enc.Utf8.parse(message)
    const signature = CryptoJS.enc.Base64.stringify(wordArray)
    return signature
}

const decryptBase64 = (signature) => {
    const wordArray = CryptoJS.enc.Base64.parse(signature)
    const message = CryptoJS.enc.Utf8.stringify(wordArray)
    return message
}


export {
    createHmacString,
    encryptBase64,
    decryptBase64
}