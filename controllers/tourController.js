const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('./handleFactory')

const topFiveToursMiddleware = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty,'
    next()
}

const createTour = factory.createOne(Tour)

const getAllTours = factory.getAll(Tour)

const updateTour = factory.updateOne(Tour)

const getOneTour = factory.getOne(Tour, {path: 'reviews'})

const deleteTour = factory.deleteOne(Tour)

const getTourStats = catchAsync(async (req, res, next) => {
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

const getMonthlyPlan = catchAsync(async (req, res, next) => {
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

const getTourWithin = catchAsync(async (req, res, next) => {
    const {distance, latlng, unit} = req.params
    const [lat, lng] = latlng.split(',')

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitutr and longitude in the format lat,lng.',
                400
            )
        );
    }

    const tours = await Tour.find({
        startLocation: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    })


    return res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
})

module.exports = {
    topFiveToursMiddleware,
    createTour,
    getAllTours,
    updateTour,
    getOneTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan,
    getTourWithin
}