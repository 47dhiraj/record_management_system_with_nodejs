import PulseLoader from 'react-spinners/PulseLoader'

import { useGetUsersQuery } from '../users/usersApiSlice'

import NewRecordForm from './NewRecordForm'

import useTitle from '../../hooks/useTitle'


const NewRecord = () => {

    useTitle('RMS: Add new record')

    const { users } = useGetUsersQuery("usersList", {   
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })


    if (!users?.length) return <PulseLoader color={"#FFF"} />

    const content = <NewRecordForm users={users} />

    return content

}

export default NewRecord
