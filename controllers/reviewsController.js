const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Review = require('../models/reviewModel')

const setIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find()

    return res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    })
})

const getOneReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
    if(!review) {
        return next(new AppError('Review with this ID does not exist', 404))
    }

    return res.status(200).json({
        status: 'success',
        review
    })
})

const createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body)
    return res.status(201).json({
        status: 'success',
        review
    })
})

const deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) {
        return next(new AppError('No review with this ID', 404))
    }

    return res.status(204).json({
        status: 'success',
        review
    })
})

const updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    if (!review) {
        return next(new AppError('No tour with this ID', 404))
    }
    return res.status(200).json({
        status: 'success',
        review
    })
})

module.exports = {
    createReview,
    deleteReview,
    updateReview,
    getOneReview,
    getAllReviews,
    setIds
}