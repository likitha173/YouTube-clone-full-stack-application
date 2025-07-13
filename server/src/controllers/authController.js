const Channel = require("../models/Channel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    // Check if channel name or email already exists
    const existingChannel = await Channel.findOne({
      $or: [
        { name: req.body.name },
        { email: req.body.email }
      ]
    });

    if (existingChannel) {
      if (existingChannel.name === req.body.name) {
        return res.status(400).json("Channel name already exists!");
      }
      if (existingChannel.email === req.body.email) {
        return res.status(400).json("Email already exists!");
      }
    }

    const hashPassword = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    const l_channel = new Channel({ ...req.body, password: hashPassword });
    await l_channel.save();

    res.status(200).send("Channel has been created!");
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      if (error.keyPattern.name) {
        return res.status(400).json("Channel name already exists!");
      }
      if (error.keyPattern.email) {
        return res.status(400).json("Email already exists!");
      }
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  const nameOrEmail = req.body.name;
  try {
    const l_channel = await Channel.findOne({
      $or: [{ email: nameOrEmail }, { name: nameOrEmail }],
    });

    if (!l_channel) return res.status(404).json("Channel not found!");

    const l_passwordCheck = await bcrypt.compare(
      req.body.password,
      l_channel.password
    );

    if (!l_passwordCheck)
      return res.status(400).json("Wrong password or channel name!");

    const accessToken = jwt.sign(
      { id: l_channel._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("accessToken", accessToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // expires in 1 day
        httpOnly: true,
        secure: false, // set to false for development (localhost)
        sameSite: "lax", // changed from strict to lax for better compatibility
      })
      .status(200)
      .json({
        id: l_channel._id,
        name: l_channel.name,
        profile: l_channel.profile,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register };
