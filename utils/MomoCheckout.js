import crypto from "crypto";
import axios from "axios"
import config from "../config/constants.js";

class MomoMethod {
    //
    createLink = async (total, userInfo, redirectHost, ipnHost) => {
        
        var partnerCode = config.MOMO_PARTNER_CODE;
        var accessKey = config.MOMO_ACCESS_KEY;
        var secretkey = config.MOMO_SECRET_KEY;
        var requestId = partnerCode + new Date().getTime();
        var orderId = new Date().valueOf() % 1000000;
        var orderInfo = "DH" + orderId;
        //link thong bao ket qua thanh toan
       // var redirectUrl = `${redirectHost}/....`;
        var redirectUrl = `${redirectHost}/homepage`;
        //var ipnUrl = "http://localhost:5000/api/checkout/momoNotify"; 
        var ipnUrl = `${ipnHost}/api/checkout/momoNotify`; 
        var amount = total;
        var requestType = "captureWallet"
        var extraData = "";      
        var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
        //signature
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        
        //json object send to MoMo endpoint
        const requestBody = {
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'en'
        };
        
        console.log("test momo")
        //Send the request and get the response
        const res = await axios.post(
            "https://test-payment.momo.vn:443/v2/gateway/api/create",
            requestBody
        )
        console.log("test momo 2")
        
        return [orderId, res.data.payUrl]

    }

    notify = (body) => {
        var accessKey = config.MOMO_ACCESS_KEY; 
        var secretkey = config.MOMO_SECRET_KEY;
        const { partnerCode,
                orderId,
                requestId,
                amount,
                orderInfo,
                orderType,
                transId,
                resultCode,
                message,
                payType,
                responseTime,
                extraData,
                signature
            } = body;
        var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData
                        +"&message=" + message+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&orderType=" + orderType+"&partnerCode=" 
                        + partnerCode +"&payType=" + payType+"&requestId=" + requestId+"&responseTime=" + responseTime
                        +"&resultCode=" + resultCode+"&transId=" + transId
        var newSignature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        return (newSignature === signature);
    }
}

export default MomoMethod;