import { gql, useQuery } from '@apollo/client';
import { Link, RouteComponentProps } from '@reach/router';
import React, { Fragment, useState } from 'react'
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
    query GetBikes($page: Int) {
        bikes(page: $page) {
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
    const {
        data,
        loading,
        error,
        fetchMore
    } = useQuery<
        BikeTypes.Query
    >(GET_BIKES);
    
    const [modal, setModal] = useState(false);
    const [currentBikeId, setCurrentBikeId] = useState(String || null);
    const toggle = () => setModal(!modal);
    
    const openModal = (bike_id: string)  => {
        setCurrentBikeId(bike_id);
        setModal(!modal)
    }

    if (loading) return <Loading />;
    if (error || !data) return <p>{error?.message}</p>;

    return (
        <Fragment>
            {data.bikes &&
                data.bikes.data &&
                data.bikes.data.map((bike: any) => (
                    <StyledDiv key={bike.bike_id} >
                        {bike.bike_id} -
                        {bike.vehicle_type} -
                        <button type="button" onClick={() => openModal(bike.bike_id)}>
                            Display
                        </button>
                    </StyledDiv>
                ))}
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
    backgroundColor: 'lightgrey'
});