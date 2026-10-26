import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api";

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async () => {
      try{
 console.log("slice called")
        const response = await api.get("/admin/checkauth");
        console.log("called ")
        return response.data.decoded;
      }
      catch(error){
        console.log("my error",error?.response?.data?.message)
      }
     
    }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    loading: false,
    isLoggedIn: false
  },
 

  reducers: {
    setUser: (state, action) => {
      console.log("user at redux" ,action.payload)
      state.user = action.payload;
       state.isLoggedIn = true;
    }
  },
  extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })

            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.loading = false;
            })

            .addCase(checkAuth.rejected, (state) => {
                state.user = null;
                state.isLoggedIn = false;
                state.loading = false;
            });
    }
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;

























// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// // import { API } from "/axios";

// export const fetchUser = createAsyncThunk("user/fetch", async () => {
//     try {
//         const res = await API.get("/admin/getdata")
//         return res.data.user
//     }
//     catch (error) {
//         return error.message
//     }
// })


// const authSlice = createSlice({
//     name: "auth",
//     initialState: {
//         user: null,
//         loading: true,
//         error: ""
//     },

//     extraReducers: (builder) => {
//         builder.addCase(fetchUser.pending, (state) => {
//             state.loading = true
//         })
//         builder.addCase(fetchUser.fulfilled, (state, action) => {
//             // console.log("user in redux", action.payload)
//             state.user = action.payload
//             state.loading = false
//         })
//         builder.addCase(fetchUser.rejected, (state, action) => {
//             // console.log("error in redux", action.payload)
//             state.error = action.payload
//             state.loading = false
//         })
//     },
//     reducers: {
//         setUser: (state, action) => {
//             state.user = action.payload
//         },
//         setLoading: (state, action) => {
//             state.loading = action.payload
//         }
//     }
// })

// export const { setUser, setLoading } = authSlice.actions
// export default authSlice.reducer