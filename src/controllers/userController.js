// import db
var { db } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/** Packages Section */
const speakeasy = require("node-2fa");
const qrCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// import mail module
const { sendEmail, sendForgotPasswordEmail } = require("../services/mail");
// import userId module
const { getUserIdFromToken } = require("../services/getUserId");

// create main Model
const User = db.users;

// create new user
async function createNewUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // check email exist or not
    let checkEmail = await User.findOne({
      where: { email: email },
    });
    if (checkEmail) {
      return res.status(409).json({
        messlage: "Email already exist",
      });
    }
    // create user
    const user = await User.create({
      name,
      email,
      password,
    });
    // Send a welcome email
    await sendEmail(email);
    // return response
    return res.status(201).json({
      messlage: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// login user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const secretKey = "ewm8434";
    // Find the user by email
    const user = await User.findOne({ where: { email: email } });

    const loginUserId = user.id;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token upon successful login
    const accessToken = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    // Generate a refresh token with a longer expiration time
    const refreshToken = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      loginUserId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// get new accessToken with refresh token
async function refreshToken(req, res) {
  try {
    const refreshToken = req.body.refreshToken;
    const secretKey = "ewm8434";
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, secretKey);

    // Check if the user exists
    const user = await User.findByPk(decoded.userId);
    const loginUserId = user.id;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a new access token with a short expiration time
    const accessToken = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ accessToken, loginUserId });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
}
// update password
async function updatePassword(req, res) {
  // Get the token from the request header or body
  const token = req.headers.authorization || req.body.token;
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = getUserIdFromToken(token);
    // console.log(userId)
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find the user by their ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the current password matches the user's stored password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password before updating it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to generate a random 6-digit string
function generateRandomSixDigitNumber() {
  const min = 100000;
  const max = 999999;
  const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomString = randomInt.toString();
  return randomString;
}

// forgot password
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a random 6-digit password
    const newPassword = generateRandomSixDigitNumber();
    console.log(newPassword);
    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    // insert password
    user.password = hashedPassword;
    await user.save();
    // send email
    sendForgotPasswordEmail(email, newPassword);
    res.json({ message: "Password sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// create 2fa with google auth app
async function createTwoFA(req, res) {
  // Get the token from the request header or body
  const token = req.headers.authorization || req.body.token;
  try {
    const userId = getUserIdFromToken(token);
    // console.log(userId)
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Find the user by their ID
    const user = await User.findByPk(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Generate a secret key for the user
    const { secret } = speakeasy.generateSecret({ length: 20 });

    // Store the secret key
    user.two_factor_secret = secret;
    await user.save();

    // Generate the OTP authentication URL manually
    const otpAuthUrl = `otpauth://totp/${user.name}?secret=${secret}&issuer=ExpressWithMySql`;
    // create image name
    const imageName = `user_${user.id}_${user.name}.jpg`;

    // Generate a QR code and save it as an image
    const qrCodePath = path.join("./src/public/authQrCodes", imageName);
    // console.log(qrCodePath)
    // Write the file to the server
    fs.writeFile(qrCodePath, otpAuthUrl, (err) => {
      if (err) {
        console.error(err);
      }
    });
    await qrCode.toFile(qrCodePath, otpAuthUrl);
    // create app url
    const APP_PORT = process.env.APP_PORT;
    const Host = process.env.Host;
    const APP_URL = `http://${Host}:${APP_PORT}`;
    const qrImageUrl = APP_URL + "/" + imageName;

    res.status(200).json({
      message: "QR Code created successfully",
      qrImageUrl,
    });

    // http://127.0.0.1:3333/client_2_Saif.jpg
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// verify 2fa
async function twoFAVerify(req, res) {
  // Get the token from the request header or body
  const token = req.headers.authorization || req.body.token;
  try {
    // Get the code from the request
    const {userTwoFACode} = req.body
 
    const userId = getUserIdFromToken(token);
    // console.log(userId);
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Find the user by their ID
    const user = await User.findByPk(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the user's secret key from the database
    const userSecretFromDatabase = user.two_factor_secret

    // Verify the OTP code
    const isValid = speakeasy.verifyToken(
      userSecretFromDatabase,
      userTwoFACode
    )
    // return isValid

    if (isValid) {
      // 2FA code is valid
      // Proceed with the desired action (e.g., authentication)
      res.status(200).json({
        message: "2FA code is valid"
      });
    } else {
      // 2FA code is invalid
      res.status(401).json({
        message: "Invalid 2FA code"
      });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// export all function
module.exports = {
  createNewUser,
  loginUser,
  refreshToken,
  updatePassword,
  forgotPassword,
  createTwoFA,
  twoFAVerify,
};
