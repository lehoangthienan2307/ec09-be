
class CodMethod {
  
    createLink = async (amount, userInfo, redirectUrl) => {
        const orderId = Math.floor(Math.random() * Math.pow(10, 10) - Math.pow(10, 10 - 1) - 1) + Math.pow(10, 10 - 1);
        const url = null;
        return [orderId, url]
    }

    getCurrency = () => {
        return 'vnd'
    }
}

export default CodMethod;