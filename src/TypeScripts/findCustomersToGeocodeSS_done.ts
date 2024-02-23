/**
 * findCustomersToGeocodeSS_done.ts
 *
 * @NScriptName Find Customers to Geocode - Scheduled
 * @NScriptType ScheduledScript
 * @NApiVersion 2.1
 */

import log = require('N/log');
import task = require('N/task');

export function execute() {
  const suiteQLTask = task.create({
    taskType: task.TaskType.SUITE_QL,
    filePath: 'Customers to Geocode/customers.csv',
    query: `
      SELECT customer.id, entityid, REPLACE(addrtext, CHR(10), ' ') AS address
      FROM customer
      JOIN EntityAddress ON entityAddress.nkey = defaultShippingAddress
      WHERE custentity_hitc_maps_latitude IS NULL AND isInactive = 'F' AND addr1 IS NOT NULL
    `,
  });
  suiteQLTask.addInboundDependency(task.create({ taskType: task.TaskType.MAP_REDUCE, scriptId: 'customscript_geocode_customers_mr_done' }));
  suiteQLTask.submit();
  log.audit('execute', `Execution finished at ${new Date()}.`);
}
