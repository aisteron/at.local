import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'sms',
	initialState: {
		smsid: null,
		code: null,
		verified: false,
		num: null
	},

	reducers: {
		set_verified: (state, action) => {
			const{verified, code, smsid} = action.payload
			state.verified = verified
			state.code = code
			state.smsid = smsid
		},

		set_num:(state,action)=>{
			state.num = action.payload
		}

	}
})

export const {
	set_verified,
	set_num
} = slice.actions


export const store = configureStore({
	reducer: slice.reducer
})
