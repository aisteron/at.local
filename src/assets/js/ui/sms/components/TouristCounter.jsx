import React, { useState } from "react";
import { icon_minus, icon_plus } from "../icons.jsx";



export const TouristCounter = () => {

	const [childCount, setChildCount] = useState(0)
	const [adultCount, setAdultCount] = useState(1)

	const count = (arr) => {
		const [age, action] = arr;
		console.log(age, action)
	}

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
					<button className="down" type="button">{icon_minus}</button>
					<input type="number" defaultValue="0" />
					<button className="up" type="button">{icon_plus}</button>
				</div>
			</div>
		</div>
	)
}