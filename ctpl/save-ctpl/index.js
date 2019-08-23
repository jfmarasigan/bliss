"use strict";
const saveCtpl = require('save');
const response = require('./response');

exports.handler = async (event) => {
    if (event.isPing) {
        console.log('Ping event');
    } else {
        console.log("Starting saving of ECTPL record...");
        let saveData = JSON.parse(event.body);
        try {
            return await saveCtpl.save(saveData);
        } catch (error) {
            console.error(error);
            return response.error(error);
        }
    }
};