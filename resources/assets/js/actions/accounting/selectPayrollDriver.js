import axios from "axios";
import { SELECT_DRIVER_PAYROLL } from "../types";

export const selectPayrollDriver = load => dispatch => {
  dispatch({
    type: SELECT_DRIVER_PAYROLL,
    payload: load
  })
}
