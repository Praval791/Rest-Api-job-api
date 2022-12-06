const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  // const { name, email, password } = req.body;
  // if (!name || !password || !email) {
  //     throw new BadRequestError('Please Fill Up All The Details')
  // }

  // const salt = await bcryptJs.genSalt(10);
  // const hashedPassword = await bcryptJs.hash(password, salt,)
  // const tempUser = { name, email, password: hashedPassword }

  const user = await User.create({ ...req.body });
  // const token = jwt.sign({ userId: user._id, name: user.name }, 'jwtsecret', { expiresIn: '30d' })
  const token = user.createToken();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  // console.log(req.headers);
  const { email, password } = req.body;
  if ((!email, !password)) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // Compare Password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials (wrong Password)");
  }
  const token = user.createToken();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
