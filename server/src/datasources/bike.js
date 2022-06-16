const { RESTDataSource } = require('apollo-datasource-rest');

class BikeAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://kovan-dummy-api.herokuapp.com/';
    }

    async getBikes(page, vehicleType, bikeId) {
        const response = await this.get('items', {
            page: page,
            vehicle_type: vehicleType ?? "",
            bike_id: bikeId ?? ""
        });
        return this.getBikesReducer(response);
    }

    getBikesReducer(data) {
        return {
            last_updated: data.last_updated || "",
            ttl: data.ttl || 0,
            data: Array.isArray(data?.data?.bikes) ? data?.data?.bikes.map(bike => this.bikeReducer(bike)) : data?.data?.bike ? [this.bikeReducer(data?.data?.bike)] : null,
            total_count: data.total_count || 0,
            nextPage: data.nextPage || false,
        }
    }

    bikeReducer(bike) {
        if(!bike) return null
        return {
            bike_id: bike?.bike_id || "",
            lat: bike?.lat || 0,
            lon: bike?.lon || 0,
            is_reserved: bike?.is_reserved || false,
            is_disabled: bike?.is_disabled || false,
            vehicle_type: bike?.vehicle_type || "",
        }
    }
}

module.exports = BikeAPI;