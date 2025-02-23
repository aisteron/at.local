import React, { useEffect, useState } from "react";
import { icon_chevron } from "../icons.jsx";
import { declension, Fetch, qs } from "../../../libs.js";
import { useDispatch, useSelector } from "react-redux";
import { set_currency, set_date } from "../store.js";

export const DateSelect = () => {
	const [loading, setLoading] = useState(true)
	const [list, setList] = useState([])
	const [error, setError] = useState(false)
	const [open, setOpen] = useState(false)
	const date = useSelector(state => state.date)


	const dispatch = useDispatch()

	// fetch
	useEffect(() => {
		Fetch('get_tour_schedule_sms', { id: +qs('body').getAttribute('resid') }, '/api')
			.then(r => {

				setLoading(false)

				if (r?.success == false) {
					setError(true)
					new Snackbar(r?.message)
					setList([])
					return;
				}

				setList(r)
				!date && dispatch(set_date(r[0]))
				dispatch(set_currency(r[0].currency))

			})
	}, [])


	return (
		<div className="select">
			{loading ? 'Загрузка..' : ''}
			{error ? 'Ошибка' : ''}

			<div className="selected">
				{list.length ? <DateItem el={date} setOpen={setOpen} open={open} /> : null}
			</div>
			<div className={`body ${open ? 'open' : ''}`}>
				{list.map(el => <DateItem el={el} key={el.MIGX_id} setOpen={setOpen} />)}
			</div>


		</div>
	)
}

// dispatch select_date to redux
const DateItem = ({ el, open, setOpen }) => {

	const date = useSelector(state => state.date)

	const dispatch = useDispatch()

	let start = new Date(el.start).toLocaleDateString()
	let finish = new Date(el.finish).toLocaleDateString()
	let seats = el.seats
	let price = el.price
	let cur = el.currency

	const expand = () => {
		if (open == undefined) {
			setOpen(false)
			dispatch(set_date(el))
			return
		}

		setOpen(!open)
	}

	return (
		<div className={`item ${!+seats ? ' disabled' : ''} ${date?.MIGX_id == el.MIGX_id ? 'isSelected' : ''}`} onClick={() => expand()}>
			<div className="head">
				<span className="date">{start} - {finish}</span>
				<button type="button " className={open ? 'open' : null}>{icon_chevron}</button>
			</div>
			<div className="dsc">
				<span className="seats">{seats} {declension("место", "мест", "мест", seats)}</span>
				<span className="price">{price.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} {cur} за место</span>
			</div>

		</div>
	)
}