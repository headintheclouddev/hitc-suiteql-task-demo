/**
 * findCustomersToGeocodeSS_done.ts
 *
 * @NScriptName Find Customers to Geocode - Scheduled
 * @NScriptType ScheduledScript
 * @NApiVersion 2.1
 */

import log = require('N/log');

export function execute() {
  log.audit('execute', `Execution finished at ${new Date()}.`);
  // TODO: SELECT customer.id, entityid, addrtext, addr1
  // FROM customer
  // LEFT OUTER JOIN EntityAddressbook AS AddressBook ON AddressBook.Entity = Customer.ID AND AddressBook.defaultbilling = 'T'
  // LEFT OUTER JOIN EntityAddress AS address ON address.nkey = AddressBook.AddressBookAddress
  // WHERE custentity_hitc_maps_latitude IS NULL AND isInactive = 'F' AND addr1 IS NOT NULL
}
