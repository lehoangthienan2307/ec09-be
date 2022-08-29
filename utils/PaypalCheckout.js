import config from "../config/constants.js"
import { encryptBase64 } from "../utils/crypto.js"
import axios from "axios"

class PaypalMethod {

    getAuthorize = () => {
        const clientId = config.PAYPAL_CLIENT_ID;
        const secret = config.PAYPAL_SECRET
        const signature = encryptBase64([clientId, secret].join(":"))

        const headers = {
            "Authorization": `Basic ${signature}`,
            "Content-Type": "application/json"
        }
        return headers
    }

   
    createLink = async (amount, userInfo, redirectHost, ipnHost) => {
        const intent = "CAPTURE";
        const description = "Pay with paypal";
        const redirectUrl = `${redirectHost}/checkout/paypalState`

        const payer = {
            email_address: userInfo.email,
            name: {
                name: userInfo.name
            },
            phone: {
                phone_number: {
                    national_number: userInfo.phone
                }
            },
            description: description
        };
        const purchaseUnits = [{
            amount: {
                currency_code: 'USD',
                value: amount
            },
        }]
        const applicationContext = {
            redirect_url: redirectUrl
        }

        const requestBody = {
            intent: intent,
            purchase_units: purchaseUnits,
            payer: payer,
            application_context: applicationContext
        }
        const headerConfig = {
            headers: this.getAuthorize()
        }

        const response = await axios.post(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            requestBody,
            headerConfig
        )

        const { id, links } = response.data
        const [{ href }] = links.filter(item => (item.rel === "approve"))
        return [id, href]
    }

    getDetail = async (orderId) => {
        const headerConfig = {
            headers: this.getAuthorize()
        }

        const response = await axios.get(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
            headerConfig
        )
        const { data } = response;
        return data;
    }

    capturePayment = async (orderId) => {
        const requestBody = {}
        const headerConfig = {
            headers: this.getAuthorize()
        }

        const response = await axios.post(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
            requestBody,
            headerConfig
        )
        const { data } = response;
        return data;
    }

   
}

export default PaypalMethod