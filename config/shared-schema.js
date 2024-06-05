import mongoose from 'mongoose'
export const DateTimeSchema = new mongoose.Schema({
    day: Number,
    month: Number,
    year: Number,
    hour: Number,
    minute: Number,
    datestamp: String,
    timestamp: Date,
    mongoTimestamp: String
  })