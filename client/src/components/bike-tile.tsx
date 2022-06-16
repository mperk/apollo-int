import { gql, useQuery } from '@apollo/client';
import React from 'react';
import * as BikeTypes from '../__generated__/gql-bike-types';
import Loading from './loading';

interface BikeTileProps {
    bikeId: string,
    vehicleType?: string,
    page?: number
}

export const GET_BIKE = gql`
    query GetBike($bikeId: String!, $page: Int, $vehicleType: String) {
        bike(bikeId: $bikeId, page: $page, vehicleType: $vehicleType) {
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
    const { data, loading, error } = useQuery<BikeTypes.Query, BikeTypes.QueryBikeArgs>(GET_BIKE, {
        variables: {
            bikeId
        }
    });
    if (loading) return <Loading />;
    if (error || !data) return <p>{error?.message}</p>;

    return (
        <div>
            {data.bike &&
                data.bike?.data &&
                <div>
                    <p><b>Bike Id: </b>{data.bike.data.bike_id}</p>
                    <p><b>Vehicle Type: </b>{data.bike.data.vehicle_type}</p>
                    <p><b>Lat: </b>{data.bike.data.lat}</p>
                    <p><b>Lon: </b>{data.bike.data.lon}</p>
                    <p><b>Is Reserved: </b>{data.bike.data.is_reserved?.toString()}</p>
                    <p><b>Is Disabled: </b>{data.bike.data.is_disabled?.toString()}</p>
                </div>
            }
        </div>
    );
}

export default BikeTile;