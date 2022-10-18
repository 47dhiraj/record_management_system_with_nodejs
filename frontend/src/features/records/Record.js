import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { memo } from 'react'                   

import { useGetRecordsQuery } from './recordsApiSlice'

import useTitle from '../../hooks/useTitle'


const Record = ({ recordId }) => {

    useTitle('RMS: Records List')

    const { record } = useGetRecordsQuery("recordsList", {
        selectFromResult: ({ data }) => ({
            record: data?.entities[recordId]
        }),
    })
    

    const navigate = useNavigate()

    if (record) {
        const created = new Date(record.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(record.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/records/${recordId}`)

        return (
            <tr className="table__row">
                <td className="table__cell record__status">
                    {record.completed
                        ? <span className="record__status--completed">Completed</span>
                        : <span className="record__status--open">Open</span>
                    }
                </td>

                <td className="table__cell record__title">{record.title}</td>
                <td className="table__cell record__username">{record.username}</td>

                <td className="table__cell record__created">{created}</td>
                <td className="table__cell record__updated">{updated}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null

}

const memoizedRecord = memo(Record)  

export default memoizedRecord