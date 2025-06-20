import { IVendor } from "../models/vendor";
import { PaginationQuery } from "./admin.type";

export interface ClientVendorQuery extends Omit<PaginationQuery<IVendor>, 'sort' >   {
    sort : Record<string,number>
}