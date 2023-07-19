const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.topFiveToursMiddleware = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty,'
    next()
}

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)
    return res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})

exports.getAllTours = catchAsync(async (req, res, next) => {
    const toursFeature = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .fields()
        .paginate()

    const tours = await toursFeature.query

    return res.status(201).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    if (!tour) {
        return next(new AppError('No tour with that ID', 404))
    }
    return res.status(203).json({
        status: 'success',
        tour
    })
})

exports.getOneTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id)
    if (!tour) {
        return next(new AppError('No tour with that ID', 404))
    }
    return res.status(200).json({
        status: 'success',
        tour
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)
    if (!tour) {
        return next(new AppError('No tour with that ID', 404))
    }
    return res.status(200).json({
        status: 'success',
        message: 'Tour successfully deleted'
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $group: {
                _id: {$toUpper: '$difficulty'},
                numTours: {$sum: 1},
                numRating: {$sum: '$ratingsQuantity'},
                avgPrice: {$avg: '$price'},
                avgRating: {$avg: '$ratingsAverage'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
            }
        },
        {
            $addFields: {difficulty: '$_id'}
        },
        {
            $project: {_id: 0}
        }
    ])
    return res.status(201).json({
        status: 'success',
        result: stats.length,
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-01`),
                }
            }
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                tourSum: {$sum: 1},
                tours: {$push: '$name'}
            }
        },
        {
            $sort: {_id: 1}
        },
        {
            $addFields: {month: '$_id'}
        },
        {
            $project: {'_id': 0}
        }
    ])
    return res.status(201).json({
        status: 'success',
        result: plan.length,
        data: {
            plan
        }
    })
})