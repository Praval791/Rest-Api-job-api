const Job = require("../models/Job");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteAlljobs = async (req, res) => {
  const jobs = await Job.deleteMany({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).send(`All jobs have been deleted`);
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  // if (!mongoose.isValidObjectId(jobId)) {
  //     throw
  // }
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (!company || !position) {
    throw new BadRequestError("company and position feild must be provided");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`no job with id : ${jobId}`);
  }
  res
    .status(StatusCodes.OK)
    .send(`Deleted!! job with id : ${jobId} is deleted.`);
};

module.exports = {
  getAllJobs,
  createJob,
  deleteAlljobs,
  getJob,
  updateJob,
  deleteJob,
};
