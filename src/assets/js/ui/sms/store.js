import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'sms',
	initialState: {
		goods_loading: true,
	},

	reducers: {
		set_path: (state, action) => {

			let p = action.payload.path
			p == null
				? state.fields.path.pop() // кнопка назад
				: state.fields.path = [...state.fields.path, p]

		}
	}
})

export const {
	set_path
} = slice.actions


export const store = configureStore({
	reducer: slice.reducer
})
