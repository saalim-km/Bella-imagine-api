export interface IVendorsFilter {
    location ?: string;
    languages?: string;
    category ?: string;
    minCharge?: number;
    maxCharge?: number;
    page?: number;
    limit?: number;
}