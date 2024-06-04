import mongoose from 'mongoose'
import { DateTimeSchema } from '../config/shared-schema'
import { tables } from '../config'

const MemberSchema = new mongoose.Schema({
    agentId: {
        type: String,
    },
    url: {
        type: String,
    },
    platform: {
        type: String,
    },
    percentage: {
        type: Number,
    },
    userId: {
        type: String,
    },
    pwd : {
        type: String,
    },
    parent : {
        type: String,
    },
    prefix : {
        type: String,
    },
    currentSessionToken : {
        type: String,
    },
    sessionStartTime : DateTimeSchema,
    agentname : {
        type: String,
    },
    password: {
        type: String
    },
    username: {
        type: String
    },
    clientApiSecret: {
        type: String
    },
    callbackUrl: {
        type: String
    },
    accountType: {
        type: String
    },

}, {
    timestamps: true
})

export const MemberModel = mongoose.model(tables.MEMBER, MemberSchema, tables.MEMBER)

