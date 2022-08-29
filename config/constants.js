import dotenv from "dotenv";
dotenv.config();

const config = {
 
    JWT_EXPIRE: 7*24*60*60*1000,

    MAILING_SERVICE_CLIENT_ID : process.env.MAILING_SERVICE_CLIENT_ID ,
    MAILING_SERVICE_CLIENT_SECRET : process.env.MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN : process.env.MAILING_SERVICE_REFRESH_TOKEN ,
    SENDER_EMAIL_ADDRESS : process.env.SENDER_EMAIL_ADDRESS,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,

    MOMO_PARTNER_CODE : "MOMO6ORU20220626",
    MOMO_ACCESS_KEY : "gEHSezk7hvD38i7Q",
    MOMO_SECRET_KEY : "KXvXWPusKEfT89o74PIXi2ZicX1Wfgou",
    DISTANCE_API_KEY : "AIzaSyCbuwQyCde1CjCoPllUUf9dpC4_6Iy8qCk",

};

export default config;