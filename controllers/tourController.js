const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

exports.topFiveToursMiddleware = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty,'
    next()
}

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