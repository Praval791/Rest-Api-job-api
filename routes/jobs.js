const express = require('express')
const router = express.Router()
const { getAllJobs, getJob, createJob, updateJob, deleteJob, deleteAlljobs } = require('../controllers/jobs')

router.route('/').post(createJob).get(getAllJobs).delete(deleteAlljobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router