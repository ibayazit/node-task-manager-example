const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [60, 'Name must be less than or equal to 60 characters']
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Task', TaskSchema)