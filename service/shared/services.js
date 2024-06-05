'use strict';
import moment from "moment"
import fs from 'fs'
import path from 'path'



export default class Services {

    success({ statusCode = 200, token = undefined, data = [], totalCounts = null, message = "" }) {
        return {
            status: 'success',
            statusCode,
            token,
            data,
            totalCounts,
            message
        };
    }

    fail({ message = "Something went wrong", statusCode = 500 }) {
        const error = new Error(message);
        error.statusCode = statusCode;
        return error;
    }

    getDateTime(dateTime) {
        return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    }

    getNextDayDateTime(dateTime) {
        return moment(dateTime).add(1,'days').format("YYYY-MM-DD HH:mm:ss");
    }

    getDateOnly(dateTime) {
        return moment(dateTime).format("YYYY-MM-DD");
    }

    getNextDayDateOnly(dateTime) {
        return moment(dateTime).add(1,'days').format("YYYY-MM-DD");
    }

    clearImage(filePath) {
        filePath = path.join(__dirname, "../", filePath);
        fs.unlink(filePath, err => {
            console.log(err);
        });
    }

    paginate(page, limit) {
        let pagination = {};
        if (limit)
            pagination.limit = parseInt(limit);
        pagination.offset = parseInt(page) ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 0) : 0;
        return pagination;
    }

}
