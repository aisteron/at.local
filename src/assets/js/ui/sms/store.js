import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'sms',
	initialState: {
		smsid: null,
		code: null,
		verified: false,
		num: null,
		date: null,
		adult: 1,
		child: 0
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
		},

		set_date:(state, action) => {
			state.date = action.payload
		},

		set_tourist_count:(state, action) => {
			const{type, count} = action.payload
			state[type] = count
		}

	}
})

export const {
	set_verified,
	set_num,
	set_date,
	set_tourist_count
} = slice.actions


export const store = configureStore({
	reducer: slice.reducer
})
