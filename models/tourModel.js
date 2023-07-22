const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        ratingsAverage: {
            type: Number,
            default: 0
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty']
        },
        summary: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            required: [true, 'A tour must have a description']
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have an image cover']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date]
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)

tourSchema.virtual('reviews', {
    ref: "reviews",
    foreignField: 'tour',
    localField: '_id'
})

const Tour = mongoose.model("tours", tourSchema)

module.exports = Tour
