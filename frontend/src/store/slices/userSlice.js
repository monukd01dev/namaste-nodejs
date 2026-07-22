import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name : 'user',
    initialState : null,
    reducers : {
        // for login
        addUser : (state,action)=>{
            return action.payload
        },
        // for logout
        removeUser : (state,action) =>{
            return null
        }
    }
})

export const {addUser,removeUser} = userSlice.actions;
export default userSlice.reducer;