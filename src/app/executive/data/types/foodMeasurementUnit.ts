export interface FoodMeasurementUnit {
    unitName: string,
    unit: number
    subUnitName: string,
    subUnit: number
}
export interface FoodMeasurementUnitResponse {
    message: string,
    statusCode: number,
    entity: FoodMeasurementUnit[]
}