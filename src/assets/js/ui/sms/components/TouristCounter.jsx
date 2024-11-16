import React, { useEffect, useState } from "react";
import { icon_minus, icon_plus } from "../icons.jsx";



export const TouristCounter = () => {

	const [childCount, setChildCount] = useState(0)
	const [adultCount, setAdultCount] = useState(1)

	const count = (arr) => {
		const [age, action] = arr;

		switch (age) {
			case "adult":
				if (action == "minus") {
					if (adultCount == 1) return
					setAdultCount(adultCount - 1)
				}
				if (action == "plus") setAdultCount(adultCount + 1)
				if (action?.value) setAdultCount(action.value)
				break;

			case "child":
				if (action == "minus") {
					if (childCount == 0) return
					setChildCount(childCount - 1)
				}
				if (action == "plus") setChildCount(childCount + 1)
				if (action?.value) setChildCount(action.value)
				break;
		}
	}

	// слушать внешний custom event
	useEffect(() => {
		function handler(event) {
			setAdultCount(event.detail.count)
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
				<span className="title">Детей</span>
				<div className="wrap">
					<button className="down" type="button" onClick={_ => count(["child", "minus"])}>{icon_minus}</button>
					<input type="number" value={childCount} onChange={e => count(["child", { value: +e.target.value }])} />
					<button className="up" type="button" onClick={_ => count(["child", "plus"])}>{icon_plus}</button>
				</div>
			</div>
		</div>
	)
}