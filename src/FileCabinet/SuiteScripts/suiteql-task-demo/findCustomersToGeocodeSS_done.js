/**
 * findCustomersToGeocodeSS_done.ts
 *
 * @NScriptName Find Customers to Geocode - Scheduled
 * @NScriptType ScheduledScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/log", "N/task"], function (require, exports, log, task) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.execute = void 0;
    function execute() {
        const suiteQLTask = task.create({
            taskType: task.TaskType.SUITE_QL,
            filePath: 'Customers to Geocode/customers.csv',
            query: `
      SELECT customer.id, entityid, REPLACE(addrtext, CHR(10), ' ') AS address
      FROM customer
      LEFT OUTER JOIN EntityAddressbook AS AddressBook ON AddressBook.Entity = Customer.ID AND AddressBook.defaultbilling = 'T'
      LEFT OUTER JOIN EntityAddress AS address ON address.nkey = AddressBook.AddressBookAddress
      WHERE custentity_hitc_maps_latitude IS NULL AND isInactive = 'F' AND addr1 IS NOT NULL
    `,
        });
        suiteQLTask.addInboundDependency(task.create({ taskType: task.TaskType.MAP_REDUCE, scriptId: 'customscript_geocode_customers_mr_done' }));
        suiteQLTask.submit();
        log.audit('execute', `Execution finished at ${new Date()}.`);
    }
    exports.execute = execute;
});
