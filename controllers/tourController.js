const Tour = require('../models/tourModel')

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
        const query = {...req.query}
        const limit = query.limit | 4
        const page = query.page | 1
        const skip = (page - 1) * limit

        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(field => delete query[field])
        const queryString = JSON.stringify(query).replace(/\b(gte|gt|lte|lt)\b/g, el => `$${el}`)


        const toursQuery = Tour.find(JSON.parse(queryString)).limit(limit).skip(skip)

        // sorting
        if (req.query.sort) {
            toursQuery.sort(req.query.sort)
        } else {
            toursQuery.sort('createdAt')
        }

        // fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            toursQuery.select(fields)
        } else {
            toursQuery.select('-__v')
        }

        const tours = await toursQuery

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