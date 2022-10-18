import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { store } from '../../app/store'

import { recordsApiSlice } from '../records/recordsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'


const Prefetch = () => {

    useEffect(() => {

        store.dispatch(recordsApiSlice.util.prefetch('getRecords', 'recordsList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))

    }, [])


    return <Outlet />        

}


export default Prefetch