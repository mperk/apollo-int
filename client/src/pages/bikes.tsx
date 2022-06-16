import { gql, useQuery } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import styled from 'react-emotion';
import { Loading } from '../components';
import BikeTile from '../components/bike-tile';
import { Modal } from '../components/modal/modal';
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
    const [ttl, setTtl] = React.useState(0);
    const {
        data,
        loading,
        error,
        refetch
    } = useQuery<BikeTypes.Query, BikeTypes.QueryBikesArgs>(GET_BIKES, {
        variables: {
            page: currentPage,
            vehicleType: vehicleTypeFilter
        },
        onCompleted: (data) => {
            if (data.bikes?.ttl) {
                setTtl(data.bikes.ttl);
            }
        },
        notifyOnNetworkStatusChange: true
    });

    const [modal, setModal] = useState(false);
    const [currentBikeId, setCurrentBikeId] = useState(String || null);
    const toggle = () => setModal(!modal);

    const openModal = (bike_id: string) => {
        setCurrentBikeId(bike_id);
        setModal(!modal);
    }

    const handleVehicleTypeSelect = (e: any) => {
        setVehicleTypeFilter(e.target.value);
        setCurrentPage(1);
        refetch();
    };

    useEffect(() => {
        if (ttl > 0) {
            const timer = setInterval(() => setTtl(ttl - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [ttl]);

    useMemo(() => {
        if(ttl === 0) refetch();
    }, [ttl])

    // useEffect(() => {
    //     if (ttl === 0) {
    //         console.log("00000000000000")
    //         setTtl(0)
    //         refetch();
    //     }
    // }, [ttl]);

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
                    <p>Will refresh in: {ttl}</p>
                    <p>Total Bookings of Listed Bikes: {data?.bikes?.total_count}</p>
                </FilterRightDiv>
            </FilterDiv>
            <ListDiv>
                {data && data.bikes &&
                    data.bikes.data && Array.isArray(data.bikes.data) &&
                    data.bikes.data.map((bike: any) => (
                        <StyledDiv >
                            {bike.bike_id} -
                            {bike.vehicle_type} -
                            <button type="button" onClick={() => openModal(bike.bike_id)}>
                                Display
                            </button>
                        </StyledDiv>
                    ))}
            </ListDiv>

            <PaginationDiv>
                <button onClick={() => currentPage === 1 ? "" : setCurrentPage(currentPage - 1)}>Previous</button>
                {currentPage} / {Math.ceil((data?.bikes?.total_count ?? 0) / 10)}
                <button onClick={() => currentPage === Math.ceil((data?.bikes?.total_count ?? 0) / 10) ? "" : setCurrentPage(currentPage + 1)}>Next</button>
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