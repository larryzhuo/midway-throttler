import { IThrottlerOption } from "traffic-throttler";
export interface IMidwayThrottlerOption extends IThrottlerOption {
    errorMsg?: string;
}
