/**
 * geocodeCustomersMapReduce.ts
 *
 * @NScriptName Geocode Customers - Map/Reduce
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */

import {EntryPoints} from "N/types";
import log = require('N/log');

export const getInputData: EntryPoints.MapReduce.getInputData = () => {
  log.audit('getInputData', `Starting at ${new Date()}.`);

}

export const map: EntryPoints.MapReduce.map = (context) => {
  log.debug(`map ${context.key}`, context.value);
  try {

  } catch(e) {
    log.error(`map ${context.key}`, e.message);
  }
}

export const summarize: EntryPoints.MapReduce.summarize = (context) => {
  log.audit('summarize', `Execution complete, usage: ${context.usage}.`);
}
