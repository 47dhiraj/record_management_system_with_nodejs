import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";


const recordsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1    
})


const initialState = recordsAdapter.getInitialState()         



export const recordsApiSlice = apiSlice.injectEndpoints({     

    endpoints: builder => ({
        getRecords: builder.query({                          

            query: () => ({
                url: '/records',                          
                                                 
                validateStatus: (response, result) => {    
                    return response.status === 200 && !result.isError
                },

            }),

            transformResponse: responseData => {            

                const loadedRecords = responseData.map(record => {
                    record.id = record._id                 

                    return record                         
                });

                return recordsAdapter.setAll(initialState, loadedRecords)   
            },


            providesTags: (result, error, arg) => {     

                if (result?.ids) {

                    return [
                        { type: 'Record', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Record', id }))     
                    ]

                } else return [{ type: 'Record', id: 'LIST' }]

            }

        }),



        addNewRecord: builder.mutation({

            query: initialRecord => ({
                url: '/records',
                method: 'POST',
                body: {
                    ...initialRecord,
                }
            }),

            invalidatesTags: [
                { type: 'Record', id: "LIST" }
            ]

        }),



        updateRecord: builder.mutation({

            query: initialRecord => ({
                url: '/records',
                method: 'PATCH',
                body: {
                    ...initialRecord,
                }
            }),

            invalidatesTags: (result, error, arg) => [
                { type: 'Record', id: arg.id }
            ]

        }),



        deleteRecord: builder.mutation({

            query: ({ id }) => ({
                url: `/records`,
                method: 'DELETE',
                body: { id }
            }),

            invalidatesTags: (result, error, arg) => [
                { type: 'Record', id: arg.id }
            ]

        }),


    }),

})




export const {

    useGetRecordsQuery,         

    useAddNewRecordMutation,    
    useUpdateRecordMutation,   
    useDeleteRecordMutation,    
    
} = recordsApiSlice


export const selectRecordsResult = recordsApiSlice.endpoints.getRecords.select()


const selectRecordsData = createSelector(  
    selectRecordsResult,                      
    recordsResult => recordsResult.data    
)


export const {

    selectAll: selectAllRecords,
    selectById: selectRecordById,
    selectIds: selectRecordIds

} = recordsAdapter.getSelectors(state => selectRecordsData(state) ?? initialState)      

