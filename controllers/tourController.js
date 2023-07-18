const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        return res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (e) {
        return res.status(400).json({
            status: 'fail',
            message: e
        })
    }
}

exports.getAllTours = async (req, res) => {
    try {
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
    } catch (e) {
        return res.status(400).json({
            status: 'fail',
            message: e
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        return res.status(203).json({
            status: 'success',
            tour: updatedTour
        })
    } catch (e) {
        return res.status(400).json({
            status: 'fail',
            message: e
        })
    }
}

exports.getOneTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        return res.status(200).json({
            status: 'success',
            tour
        })
    } catch (e) {
        return res.status(400).json({
            status: 'fail',
            message: e
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            status: 'success',
            message: 'Tour successfully deleted'
        })
    } catch (e) {
        return res.status(400).json({
            status: 'fail',
            message: e
        })
    }
}

exports.topFiveToursMiddleware = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty,'
    next()
}

exports.getTourStats = async (req, res) => {
    try {
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
    } catch (e) {
        return res.status(400).json({
            status: 'fail',
            message: e
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (e) {
        return res.status(400).json({
            status: 'fail',
            message: e
        })
    }
}