import React, { useState } from "react";
import { Fetch } from "../../../libs";
export const Order = ({ el }) => {
	const [num, setNum] = useState(el.num)
	const [approved, setApproved] = useState(el.status)

	const update_num = async e => {

		setNum(e.target.value)
		let res = await Fetch("update_order_num", { id: el.id, value: e.target.value }, "/assets/php/orders/")
		let message = res?.success ? '✅ Обновлено' : '❌ Ошибка обновления'
		new Snackbar(message)
	}

	const approve = async el => {

		let res = await Fetch("approve_order", { id: el.id, clientid: el.clientid }, "/assets/php/orders/")
		let message = res?.success ? '✅ Approved' : '❌ Ошибка обновления'
		new Snackbar(message)
		res?.success && setApproved(1);
	}

	let d = {
		created_at_date: new Date(el.createdat).toLocaleDateString(),
		created_at_time: new Date(el.createdat).toLocaleTimeString(),
		tour_date: new Date(el.tour_date).toLocaleDateString()

	}

	return (
		<li>
			<div className="num">
				<input type="text" value={num} onChange={e => update_num(e)} />
			</div>
			<span className="createdat">{d.created_at_date}<br />{d.created_at_time}</span>
			<span className="tour_name">{el.tour_name}</span>
			<span className="tour_date">{d.tour_date}</span>
			<span className="tourist_name">{el.tourist_name}</span>
			<span className="tourist_email">{el.tourist_email}</span>
			<span className="tourist_phone">{el.tourist_phone}</span>
			<span className="clientid">{el.clientid}</span>
			<div className="action">
				<button className="approve"
					onClick={_ => approve(el)}
					disabled={approved}>
					{!approved ? 'Approve' : "Approved"}
				</button>
			</div>

		</li>
	)
}