const { User } = require('./config/database.js')
const { nanoid } = require('nanoid');
const crypto = require('crypto');
const { generateTOTP } = require('./totp')
const jwt = require('jsonwebtoken');
require('dotenv').config();

// this two function is actually used as authenticator app in user smartphone, but for praprosal fasteness i made it as web app tool 
const authenticatorApp = (request, h) => {
    return h.view('authenticator')
}
const authenticatorAppResult = (request, h) => {
    const { secretKey } = request.payload;
    let otp = generateTOTP(secretKey)
    return `<h1>Your OTP is: ${otp}</h1> <br> OTP berganti tiap 30 detik`
}
// end of explanation

const verifyTwoFactorAuth = async (request, h) => {
    const {otp,token}=request.payload
    let data_payload={}
    jwt.verify(token, "AMRYYAHYA", (err, decoded) => {
        if (err) {
            return "login error"
        } else {
            data_payload=decoded
        }
    });
    const user = await User.findByPk(data_payload.user_id);
    const encryptionKey = process.env.ENCRYPTION_SECRET_KEY; // Replace with your actual key
    const iv = process.env.INITIAL_IV;
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let decrypted_secretKey = decipher.update(user.secret_key, 'hex', 'utf8');
    decrypted_secretKey += decipher.final('utf8');
    if (otp===generateTOTP(decrypted_secretKey)) {
        h.state('data', { id: user.id,email: user.email, password: user.password });
        return h.view('dashboard',{user_email: user.email, user_number: user.phone_number})
    }
    else return '<h1>unauthorized</h1>'
}

const dashboardHandler = async (request, h) => {
    const value = request.state.data;
    const user = await User.findByPk(value.id);
    if (value === undefined) {
        return h.redirect('/login')
    } else {
        return h.view('dashboard',{user_email: user.email, user_number: user.phone_number})
    }
}

const loginViewHandler = (request, h) => {
    return h.view('login')
}

const loginHandler = async (request, h) => {
    try {
        const {
            email, password
        } = request.payload;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            return '<h1>email tidak ditemukan</h1>'
        } if (user.password === hashedPassword) {
            const data_payload = {
                user_id: user.id,
                user_email: user.email
            };
            const token = jwt.sign(data_payload, "AMRYYAHYA", { expiresIn: '5m' });
            return h.view('otp',{token:token})
        }
        else return '<h1>password salah</h1>$'
    } catch (error) {
        return error.message;
    }

}

const registerViewHandler = (request, h) => {
    return h.view('register')
}
const registerHandler = async (request, h) => {
    const {
        email,phone_number, password
    } = request.payload;
    const secret_key = nanoid(32);
    const encryptionKey = process.env.ENCRYPTION_SECRET_KEY; 
    const iv = process.env.INITIAL_IV;
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let encryptedSecretKey = cipher.update(secret_key, 'utf8', 'hex');
    encryptedSecretKey += cipher.final('hex');
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    try {
        const user = await User.create({
            email: email,
            phone_number: phone_number,
            password: hashedPassword,
            secret_key: encryptedSecretKey,
        });
        if (user) return `<p>You've registered</p><br><p>your secret key: "${secret_key}". save this this is needed to generate totp</p><br><a href="/login"> Login </a>`
    } catch (error) {
        return error.message;
    }
    return true;
}

const logoutHandler = async (request, h) => {
    return h.redirect('/login').unstate('data')
}

module.exports = {
    loginViewHandler, registerViewHandler, registerHandler, loginHandler, authenticatorApp, authenticatorAppResult, verifyTwoFactorAuth, logoutHandler, dashboardHandler
};