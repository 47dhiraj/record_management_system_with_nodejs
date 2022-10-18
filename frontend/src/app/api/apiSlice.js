import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'    

import { setCredentials, logOut } from '../../features/auth/authSlice'



const baseQuery = fetchBaseQuery({               

    baseUrl: 'http://localhost:3500',
    credentials: 'include',                       

    prepareHeaders: (headers, { getState, endpoint }) => { 

        const token = getState().auth.token

        if (token && endpoint !== 'refresh')        
        {
            headers.set("authorization", `Bearer ${token}`)
        }

        return headers
    }

})



const baseQueryWithReauth = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {

        const refreshResult = await baseQuery(
            {
                url: '/auth/refresh',
                method: 'GET',
            },
            { ...api, endpoint: 'refresh' },            
            extraOptions,
        );


        if (refreshResult?.data) {

            api.dispatch(setCredentials({ ...refreshResult.data }))

            result = await baseQuery(args, api, extraOptions)

        } else {

            if (refreshResult?.error?.status === 403) 
            {
                refreshResult.error.data.message = "Your login has expired."
            }

            api.dispatch(logOut())  
            
            return refreshResult
        }

    }

    return result                               
}



export const apiSlice = createApi({             

    baseQuery: baseQueryWithReauth,             

    tagTypes: ['Record', 'User'],                                     

    endpoints: builder => ({})             

})
