import { useGetRecordsQuery } from "./recordsApiSlice"
import Record from "./Record"

import useAuth from "../../hooks/useAuth"

import PulseLoader from 'react-spinners/PulseLoader'


const RecordsList = () => {

    const { username, isManager, isAdmin } = useAuth()

    const {                                     
        data: records,
        isLoading,
        isSuccess,
        isError,
        error

    } = useGetRecordsQuery('recordsList', {   
        pollingInterval: 15000,      
        refetchOnFocus: true,                
        refetchOnMountOrArgChange: true       
    })

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids, entities } = records              

        let filteredIds
        if (isManager || isAdmin)                    
        {
            filteredIds = [...ids]

        } else {                                    
            filteredIds = ids.filter(recordId => entities[recordId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(recordId => <Record key={recordId} recordId={recordId} />)


        content = (
            <>
                <h1 style={{ textAlign: 'center' }}> Records List </h1>

                <table className="table table--records">

                    <thead className="table__thead">
                        <tr>
                            <th scope="col" className="table__th record__status">Status</th>

                            <th scope="col" className="table__th record__title">Title</th>
                            <th scope="col" className="table__th record__username">Owner</th>

                            <th scope="col" className="table__th record__created">Created</th>
                            <th scope="col" className="table__th record__updated">Updated</th>

                            <th scope="col" className="table__th record__edit">Edit</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableContent}
                    </tbody>

                </table>

            </>
        )
    }

    return content

}


export default RecordsList


