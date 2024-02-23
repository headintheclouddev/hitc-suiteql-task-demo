/**
 * geocodeCustomersMapReduce.ts
 *
 * @NScriptName Geocode Customers - Map/Reduce
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/log"], function (require, exports, log) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    const getInputData = () => {
        log.audit('getInputData', `Starting at ${new Date()}.`);
    };
    exports.getInputData = getInputData;
    const map = (context) => {
        log.debug(`map ${context.key}`, context.value);
        try {
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
