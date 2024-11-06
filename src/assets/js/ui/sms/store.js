import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'sms',
	initialState: {
		goods_loading: true,
	},

	reducers: {
		set_tourist_count: (state, action) => {

			const { count, type } = action.payload
			state[type] = count

		}
	}
})

export const {
	set_tourist_count
} = slice.actions


export const store = configureStore({
	reducer: slice.reducer
})
