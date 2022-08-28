import { States } from "../enum/states";

export interface Current {
  time: number
  state: States
  iteration: number
}
