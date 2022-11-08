import axios from "axios";
// import { stateOptions } from '../../components/forms'
import { SELECT_LOAD } from "../types.js";

// When a load is clicked on ( selected), it stores that instance under the state ->loads -> selectedLoad
// This will ultimately trigger the modal to display and show the selected load.
export const selectedLoad = load => dispatch => {
  // load = {
  //   ...load,
  //   customer: {
  //     ...load.customer,
  //     ...{ value: load.customer.id, label: load.customer.customer_name }
  //   },
  //   driver: {
  //     ...load.driver,
  //     ...{ value: load.driver.id, label: load.driver.driver_first_name }
  //   },
  // pickups: load.pickups.map(pickup => {
  //   let p = stateOptions.find(s => s.value === pickup.pickup_state)
  //   return { ...pickup, pickup_state:{ value: pickup.id, label: p.label } }
  // }),
  // deliveries: load.deliveries.map(delivery => {
  //   let del = stateOptions.find(s => s.value === delivery.delivery_state)
  //   return { ...delivery, delivery_state:{ value: delivery.id, label: del.label } }
  // })
  // }
  dispatch({
    type: SELECT_LOAD,
    payload: load
  });
};
