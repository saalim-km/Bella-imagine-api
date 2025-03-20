import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";

export const generateVendorId = (): string => {
    const uniquePart = uuidv4().split("-")[0];
    const timestamp = Date.now().toString(36); 
    const randomStr = randomBytes(3).toString("hex"); 

    return `VND-${uniquePart}-${timestamp}-${randomStr}`;
};


export const generateCategoryId = (): string => {
    const uniquePart = uuidv4().split("-")[0];
    const timestamp = Date.now().toString(36);
    const randomStr = randomBytes(3).toString("hex");

    return `CAT-${uniquePart}-${timestamp}-${randomStr}`;
};