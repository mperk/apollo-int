import { gql, useQuery } from '@apollo/client';
import { Link, RouteComponentProps } from '@reach/router';
import React, { Fragment, useEffect, useState } from 'react'
import styled, { css } from 'react-emotion';
import { Button, Loading } from '../components';
import BikeTile from '../components/bike-tile';
import { Modal } from '../components/modal/modal';
import { unit } from '../styles';
import * as BikeTypes from '../__generated__/gql-bike-types';

export const BIKE_TILE_DATA = gql`
    fragment BikeTile on Bike {
        bike_id
        vehicle_type
    }
`;

export const GET_BIKES = gql`
    query GetBikes($page: Int, $vehicleType: String) {
        bikes(page: $page, vehicleType: $vehicleType) {
            last_updated
            ttl
            data {
                ...BikeTile
            }
            total_count
            nextPage
        }
    }
    ${BIKE_TILE_DATA}
`;

interface BikesProps extends RouteComponentProps { }

const Bikes: React.FC<BikesProps> = () => {
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data,
        loading,
        error,
        refetch
    } = useQuery<BikeTypes.Query, BikeTypes.QueryBikesArgs>(GET_BIKES, {
        variables: {
            page: currentPage,
            vehicleType: vehicleTypeFilter
        }
    });

    const [modal, setModal] = useState(false);
    const [currentBikeId, setCurrentBikeId] = useState(String || null);
    const toggle = () => setModal(!modal);

    const openModal = (bike_id: string) => {
        setCurrentBikeId(bike_id);
        setModal(!modal)
    }

    const handleVehicleTypeSelect = (e: any) => {
        setVehicleTypeFilter(e.target.value);
    };

    useEffect(() => {
        refetch()
    }, [vehicleTypeFilter])

    if (loading) return <Loading />;
    if (error || !data) return <p>{error?.message}</p>;

    const handleSearchBikeId = (event: any) => {
        if (event.key === 'Enter') {
            console.log(event.target.value)
        }
    }

    return (
        <Fragment>
            <FilterDiv>
                <FilterLeftDiv>
                    <input type="text" placeholder='Search by bike_id' onKeyDown={handleSearchBikeId} />
                    <select value={vehicleTypeFilter} onChange={handleVehicleTypeSelect}>
                        <option value="">All</option>
                        <option value="scooter">Scooter</option>
                        <option value="bike">Bike</option>
                    </select>
                </FilterLeftDiv>
                <FilterRightDiv>
                    <p>Will refresh in: {data?.bikes?.ttl}</p>
                    <p>Total Bookings of Listed Bikes: {data?.bikes?.total_count}</p>
                </FilterRightDiv>
            </FilterDiv>
            <ListDiv>
                {data && data.bikes &&
                    data.bikes.data && Array.isArray(data.bikes.data) &&
                    data.bikes.data.map((bike: any) => (
                        <StyledDiv key={bike.bike_id} >
                            {bike.bike_id} -
                            {bike.vehicle_type} -
                            <button type="button" onClick={() => openModal(bike.bike_id)}>
                                Display
                            </button>
                        </StyledDiv>
                    ))}
            </ListDiv>

            <PaginationDiv>
                <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                {currentPage} / {Math.ceil((data?.bikes?.total_count ?? 0) / 10)}
                <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </PaginationDiv>
            <Modal isShown={modal} hide={toggle} modalContent={<BikeTile bikeId={currentBikeId} />} headerText="Bike Details" />
        </Fragment>
    )
}

export default Bikes;

const StyledDiv = styled('div')({
    padding: '2px',
    border: '2px solid black',
    width: '100%',
    textAlign: 'center',
    marginBottom: '4px',
    backgroundColor: '#DCDCDC'
});

const FilterDiv = styled('div')({
    width: '100%',
    marginBottom: '4px',
});

const FilterLeftDiv = styled('div')({
    maxWidth: '250px',
    marginBottom: '4px',
    float: 'left',
    paddingTop: '33px'
});

const FilterRightDiv = styled('div')({
    maxWidth: '300px',
    marginBottom: '4px',
    float: 'right'
});

const PaginationDiv = styled('div')({
    maxWidth: '100%',
    margin: '10px',
    border: '2px solid black',
    textAlign: 'center',
});

const ListDiv = styled('div')({
    maxWidth: '100%',
    padding: '10px',
    // border: '2px solid black',
    marginBottom: '15px'
});