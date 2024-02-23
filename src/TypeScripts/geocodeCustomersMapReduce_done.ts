/**
 * geocodeCustomersMapReduce_done.ts
 *
 * @NScriptName Geocode Customers - Map/Reduce - Done
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */

import {EntryPoints} from "N/types";
import file = require('N/file');
import https = require('N/https');
import log = require('N/log');
import record = require('N/record');

export const getInputData: EntryPoints.MapReduce.getInputData = () => {
  log.audit('getInputData', `Starting at ${new Date()}.`);
  const csvFile = file.load({ id: '21067' }); // TODO: Insert your file id here (or use a parameter)
  const customerAddresses: { customerId: string, address: string }[] = [];
  csvFile.lines.iterator().each((line: { value: string }) => {
    const csvColumnValues = line.value.split(','); // id, entityid, address
    const customerId = csvColumnValues[0];
    const address = csvColumnValues[2]; // Address is the 3rd (index 2) column
    log.debug('getInputData', line.value);
    if (isNaN(Number(customerId))) return true; // Skip any line where the customer id isn't a number, like the header row
    customerAddresses.push({ customerId, address });
    return true;
  });
  return customerAddresses;
}

export const map: EntryPoints.MapReduce.map = (context) => {
  log.debug(`map ${context.key}`, context.value);
  try {
    const customer = JSON.parse(context.value) as { customerId: string, address: string };
    const apiKey = 'AIzaSyDHcwOA32_zlb79CkGGYXU2bV9InyGmTTE'; // TODO: Insert your Google API key here
    const googleResponse = https.get({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${customer.address}&key=${apiKey}`
    });
    log.debug(`map ${context.key}`, `Response for input ${context.value} (at ${new Date()}): ${googleResponse.body}`);
    const parsedResponse = JSON.parse(googleResponse.body) as IGeocodeResponse;
    if (parsedResponse.status == 'OK') {
      const coordinates = parsedResponse.results[0].geometry.location as { lat: number, lng: number };
      record.submitFields({
        type: 'customer',
        id: customer.customerId,
        values: { custentity_hitc_maps_latitude: coordinates.lat, custentity_hitc_maps_longitude: coordinates.lng }
      });
      log.audit(`map ${context.key}`, `Customer Updated: ${customer.customerId} with lat ${coordinates.lat} and lng ${coordinates.lng} at ${new Date()}.`);
    }
  } catch(e) {
    log.error(`map ${context.key}`, e.message);
  }
}

export const summarize: EntryPoints.MapReduce.summarize = (context) => {
  log.audit('summarize', `Execution complete, usage: ${context.usage}.`);
}

interface IGeocodeResponse { // There's a bit more to this response data, but this is all we are concerned with here.
  results: { geometry: { location: { lat: number, lng: number } } }[];
  status: string;
}
