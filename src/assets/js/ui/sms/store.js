import { createSlice, configureStore } from '@reduxjs/toolkit'
//const is_dev = process.env.NODE_ENV == 'development'

const slice = createSlice({
	name: 'sms',
	initialState: {
		show: false,
		smsid: null,
		code: null,
		verified: false,
		num: null,
		date: null,
		adult: 1,
		child: 0,
		attempt: 0,
		total: 0
	},

	reducers: {
		set_verified: (state, action) => {
			const { verified, code, smsid } = action.payload
			state.verified = verified
			state.code = code
			state.smsid = smsid
		},

		set_num: (state, action) => {
			state.num = action.payload
		},

		set_date: (state, action) => {
			if(action.payload.seats < state.adult){
				state.adult = action.payload.seats
				state.child = 0
			}
			state.date = action.payload
			state.total = action.payload.price
		},

		set_tourist_count: (state, action) => {
			const { type, count, obj, just_open } = action.payload



			state.show = true

			let rest = type == 'adult' ? state.child : state.adult

			if (!just_open) {
				// при открытии попапа не нужно пересчитывать цену
				if (count + rest > +state.date.seats) {
					new Snackbar(`Свободных мест - ${state.date.seats}`)
					return;
				}
			}


			state[type] = count


			obj && (state.date = obj)
			state.total = recount(state)
		},

		set_show: (state, action) => {
			state.show = action.payload
		},
		set_attempt: (state, action) => {
			state.attempt = action.payload
		},
		set_currency: (state, action) => {
			state.currency = action.payload
		}

	}
})

export const {
	set_verified,
	set_num,
	set_date,
	set_tourist_count,
	set_show,
	set_attempt,
	set_currency
} = slice.actions


export const store = configureStore({
	reducer: slice.reducer
})

function recount(state) {
	const price = state.date.price

	return state.adult * price + Math.ceil(state.child * price * 0.95)
}