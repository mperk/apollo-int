const { RESTDataSource } = require('apollo-datasource-rest');

class BikeAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://kovan-dummy-api.herokuapp.com/';
    }

    async getBikes(page, vehicleType) {
        const response = await this.get('items', {
            page: page,
            vehicle_type: vehicleType ?? ""
        });
        return this.getBikesReducer(response);
    }

    async getBike(page, vehicleType, bikeId) {
        const response = await this.get('items', {
            page: page,
            vehicle_type: vehicleType ?? "",
            bike_id: bikeId
        });
        return this.getBikesReducer(response);
    }

    getBikesReducer(data) {
        return {
            last_updated: data.last_updated,
            ttl: data.ttl,
            data: Array.isArray(data?.data?.bikes) ? data?.data?.bikes.map(bike => this.bikeReducer(bike)) : this.bikeReducer(data?.data?.bike),
            total_count: data.total_count,
            nextPage: data.nextPage
        }
    }

    bikeReducer(bike) {
        if(!bike) return null;
        return {
            bike_id: bike.bike_id,
            lat: bike.lat,
            lon: bike.lon,
            is_reserved: bike.is_reserved,
            is_disabled: bike.is_disabled,
            vehicle_type: bike.vehicle_type,
        }
    }
}

module.exports = BikeAPI;