import { createSlice } from '@reduxjs/toolkit';


const adminSlice = createSlice({
name: 'admin',
initialState: { products: [], loading: false, error: null },
reducers: {
// admin CRUD reducers will be added as needed
},
});


export default adminSlice.reducer;