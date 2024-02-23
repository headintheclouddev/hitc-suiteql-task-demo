/**
 * geocodeCustomersMapReduce_done.ts
 *
 * @NScriptName Geocode Customers - Map/Reduce - Done
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/file", "N/https", "N/log", "N/record"], function (require, exports, file, https, log, record) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    const getInputData = () => {
        log.audit('getInputData', `Starting at ${new Date()}.`);
        const csvFile = file.load({ id: '21067' }); // TODO: Insert your file id here (or use a parameter)
        const customerAddresses = [];
        csvFile.lines.iterator().each((line) => {
            const csvColumnValues = line.value.split(','); // id, entityid, address
            const customerId = csvColumnValues[0];
            const address = csvColumnValues[2]; // Address is the 3rd (index 2) column
            log.debug('getInputData', line.value);
            if (isNaN(Number(customerId)))
                return true; // Skip any line where the customer id isn't a number, like the header row
            customerAddresses.push({ customerId, address });
            return true;
        });
        return customerAddresses;
    };
    exports.getInputData = getInputData;
    const map = (context) => {
        log.debug(`map ${context.key}`, context.value);
        try {
            const customer = JSON.parse(context.value);
            const apiKey = 'xxx'; // TODO: Insert your Google API key here
            const googleResponse = https.get({
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${customer.address}&key=${apiKey}`
            });
            log.debug(`map ${context.key}`, `Response for input ${context.value} (at ${new Date()}): ${googleResponse.body}`);
            const parsedResponse = JSON.parse(googleResponse.body);
            if (parsedResponse.status == 'OK') {
                const coordinates = parsedResponse.results[0].geometry.location;
                record.submitFields({
                    type: 'customer',
                    id: customer.customerId,
                    values: { custentity_hitc_maps_latitude: coordinates.lat, custentity_hitc_maps_longitude: coordinates.lng }
                });
                log.audit(`map ${context.key}`, `Customer Updated: ${customer.customerId} with lat ${coordinates.lat} and lng ${coordinates.lng} at ${new Date()}.`);
            }
        }
        catch (e) {
            log.error(`map ${context.key}`, e.message);
        }
    };
    exports.map = map;
    const summarize = (context) => {
        log.audit('summarize', `Execution complete, usage: ${context.usage}.`);
    };
    exports.summarize = summarize;
});
