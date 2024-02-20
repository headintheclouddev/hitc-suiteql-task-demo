/**
 * findCustomersToGeocodeSS.ts
 *
 * @NScriptName Find Customers to Geocode - Scheduled
 * @NScriptType ScheduledScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/log"], function (require, exports, log) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.execute = void 0;
    function execute() {
        log.audit('execute', `Execution finished at ${new Date()}.`);
    }
    exports.execute = execute;
});
