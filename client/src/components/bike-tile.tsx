import { gql, useQuery } from '@apollo/client';
import React from 'react';
import * as BikeTypes from '../__generated__/gql-bike-types';
import Loading from './loading';

interface BikeTileProps {
    bikeId?: string,
    vehicleType?: string,
    page?: number
}

export const GET_BIKES = gql`
    query GetBikes($bikeId: String!, $page: Int, $vehicleType: String) {
        bikes(bikeId: $bikeId, page: $page, vehicleType: $vehicleType) {
            last_updated
            ttl
            data {
                bike_id
                vehicle_type
                lat
                lon
                is_reserved
                is_disabled
            }
            total_count
            nextPage
        }
    }
`;

const BikeTile: React.FC<BikeTileProps> = ({ bikeId }) => {
    const { data, loading, error } = useQuery<BikeTypes.Query, BikeTypes.QueryBikesArgs>(GET_BIKES, {
        variables: {
            bikeId
        }
    });
    if (loading) return <Loading />;
    if (error || !data) return <p>{error?.message}</p>;

    return (
        <div>
            {bikeId && data.bikes &&
                data.bikes?.data && data.bikes.data[0] &&
                <div>
                    <p><b>Bike Id: </b>{data.bikes.data[0].bike_id}</p>
                    <p><b>Vehicle Type: </b>{data.bikes.data[0].vehicle_type}</p>
                    <p><b>Lat: </b>{data.bikes.data[0].lat}</p>
                    <p><b>Lon: </b>{data.bikes.data[0].lon}</p>
                    <p><b>Is Reserved: </b>{data.bikes.data[0].is_reserved?.toString()}</p>
                    <p><b>Is Disabled: </b>{data.bikes.data[0].is_disabled?.toString()}</p>
                </div>
            }
        </div>
    );
}

export default BikeTile;