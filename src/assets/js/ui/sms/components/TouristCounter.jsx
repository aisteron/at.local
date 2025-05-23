import React, { useEffect, useState } from "react";
import { icon_minus, icon_plus } from "../icons.jsx";
import { useDispatch, useSelector } from "react-redux";
import { set_tourist_count } from "../store.js";



export const TouristCounter = () => {


	const childCount = useSelector(state => state.child)
	const adultCount = useSelector(state => state.adult)
	const total = useSelector(state => state.total)

	const currency = useSelector(state => state.currency)
	const dispatch = useDispatch()

	const count = (arr) => {
		const [age, action] = arr;

		switch (age) {
			case "adult":
				if (action == "minus") {
					if (adultCount == 1) return
					dispatch(set_tourist_count({ type: "adult", count: adultCount - 1 }))

				}
				if (action == "plus") {
					dispatch(set_tourist_count({ type: "adult", count: adultCount + 1 }))
				}

				if (action?.value) {
					dispatch(set_tourist_count({ type: "adult", count: action.value }))
				}
				break;

			case "child":
				if (action == "minus") {
					if (childCount == 0) return
					dispatch(set_tourist_count({ type: "child", count: childCount - 1 }))

				}
				if (action == "plus") {
					dispatch(set_tourist_count({ type: "child", count: childCount + 1 }))
				}
				if (action?.value) {
					dispatch(set_tourist_count({ type: "child", count: action.value }))
				}
				break;
		}
	}

	// слушать внешний custom event
	useEffect(() => {

		function handler(event) {
			if (!event.detail.sms) return // если в форме aside нет класса use_sms
			let obj = { ...event.detail.tour, currency: event.detail.cur }
			dispatch(set_tourist_count({ type: "adult", just_open: true, count: event.detail.count, obj }))
		}

		document.addEventListener("update_for_dialog", handler)
		return () => document.removeEventListener("update_for_dialog", handler)
	}, [])

	return (

		<div className="counter">
			<div className="row a">
				<span className="title">Взрослых</span>
				<div className="wrap">
					<button className="down" type="button" onClick={_ => count(["adult", "minus"])}>{icon_minus}</button>
					<input type="number" value={adultCount} min="1" onChange={e => count(["adult", { value: +e.target.value }])} />
					<button className="up" type="button" onClick={_ => count(["adult", "plus"])}>{icon_plus}</button>
				</div>
			</div>

			<div className="row c">
				<span className="title">Детей до 14 лет</span>
				<div className="wrap">
					<button className="down" type="button" onClick={_ => count(["child", "minus"])}>{icon_minus}</button>
					<input type="number" value={childCount} onChange={e => count(["child", { value: +e.target.value }])} />
					<button className="up" type="button" onClick={_ => count(["child", "plus"])}>{icon_plus}</button>
				</div>
			</div>

			<div className="total">
				<span>Итого:</span>
				<span className="t"> {total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')} {currency}</span>
			</div>
		</div>
	)
}