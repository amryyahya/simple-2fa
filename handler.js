const { User } = require('./config/database.js')
const { nanoid } = require('nanoid');
const crypto = require('crypto');
const { generateTOTP } = require('./totp')

// this two function is actually used as authenticator app in user smartphone, but for praprosal fasteness i made it as web app tool 
const authenticatorApp = (request, h) => {
    return h.file('views/authenticator.html')
}
const authenticatorAppResult = (request, h) => {
    const { secretKey } = request.payload;
    console.log(typeof (secretKey));
    let otp = generateTOTP(secretKey)
    return `<h1>Your OTP is: ${otp}</h1> <br> OTP berganti tiap 30 detik`
}
// end of explanation


// verify user otp input
const verifyTwoFactorAuth = async (request, h) => {
    const { otp,user_id } = request.payload;
    const user = await User.findByPk(user_id);
    if (otp===generateTOTP(user.secret_key)) return `<h1>Hello ${user.email}, <br> You've Logged In</h1><p>This Simple Web is not using cookies/session, maybe you will auto logout in view seconds</p>`
    else return '<h1>unauthorized</h1>'

}

const loginViewHandler = (request, h) => {
    return h.file('views/login.html')
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
            return `<form action="dashboard" method="post">
                        <label for="otp">Inputkan OTP</label><br>
                        <input type="text" name="otp" id="otp"><br><br>
                        <input type="number" name="user_id" id="user_id" value=${user.id} hidden><br><br>
                        <input type="submit" value="LOGIN">
                    </form>
                    <p>Use this :</p>
                    <a href="/authenticatorapp" target="_blank">OTP GENERATOR:AUTHENTICATOR APP</a>`
        }
        else return '<h1>password salah</h1>$'
    } catch (error) {
        return error.message;
    }

}

const registerViewHandler = (request, h) => {
    return h.file('views/register.html')
}
const registerHandler = async (request, h) => {
    const {
        email, password
    } = request.payload;
    const secret_key = nanoid(8);
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    try {
        const user = await User.create({
            email: email,
            password: hashedPassword,
            secret_key: secret_key,
        });
        if (user) return `<p>You've registered</p><br><p>your secret key: "${secret_key}". save this this is needed to generate totp</p><br><a href="/login"> Login </a>`
    } catch (error) {
        return error.message;
    }
    return true;
}

module.exports = {
    loginViewHandler, registerViewHandler, registerHandler, loginHandler, authenticatorApp, authenticatorAppResult, verifyTwoFactorAuth
};