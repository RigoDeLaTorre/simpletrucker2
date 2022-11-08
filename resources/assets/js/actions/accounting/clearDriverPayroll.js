import axios from "axios";
import { CLEAR_DRIVER_PAYROLL } from "../types";

export const clearDriverPayroll = () => {
  return{
    type: CLEAR_DRIVER_PAYROLL
  }
}
