const express = require('express')
const tourController = require('./../controllers/tourController')

const tourRouter = express.Router()

tourRouter.route('/top-5').get(tourController.topFiveToursMiddleware, tourController.getAllTours)

tourRouter
    .route('/')
    .post(tourController.createTour)
    .get(tourController.getAllTours)

tourRouter
    .route('/:id')
    .delete(tourController.deleteTour)
    .put(tourController.updateTour)
    .get(tourController.getOneTour)

module.exports = tourRouter