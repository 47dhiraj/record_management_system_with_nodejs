import { useParams } from 'react-router-dom'

import EditRecordForm from './EditRecordForm'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

import { useGetRecordsQuery } from './recordsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'

import useTitle from '../../hooks/useTitle'


const EditRecord = () => {

    useTitle('RMS: Edit Record')

    const { id } = useParams()
    const { username, isManager, isAdmin } = useAuth()

    const { record } = useGetRecordsQuery("recordsList", {
        selectFromResult: ({ data }) => ({
            record: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })


    if (!record || !users?.length) return <PulseLoader color={"#FFF"} />

    if (!isManager && !isAdmin) {
        if (record.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditRecordForm record={record} users={users} />

    return content

}

export default EditRecord
