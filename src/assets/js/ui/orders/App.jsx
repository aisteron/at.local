import React, { useEffect, useState } from "react";
import "./App.sass";
import { Fetch, load_toast } from "../../libs";
import { Order } from "./components/Order.jsx";

export const App = () => {
	const [orders, setOrders] = useState([])

	useEffect(() => {
		async function fetchData() {
			let res = await Fetch("get_orders", {}, "/assets/php/orders/")
			res.sort(function (a, b) { return new Date(b.createdat) - new Date(a.createdat); });
			setOrders(res)
			load_toast()
		}
		fetchData()
	}, [])

	return (
		<>
			<div className="head">
				<span>Список заявок</span>
			</div>
			<div className="table">
				<ul className="thead">
					<li className="num">Номер заявки<br /> в реестре</li>
					<li className="createdat">Дата заявки</li>
					<li className="tour_name">Название тура</li>
					<li className="tour_date">Дата тура</li>
					<li className="tourist_name">Имя</li>
					<li className="tourist_email">Эл. почта</li>
					<li className="tourist_phone">Номер телефона</li>
					<li className="clientid">ClientID</li>
					<li className="action"></li>
				</ul>
				<ul className="tbody">
					{orders.map(el => <Order el={el} key={el.id} />)}
				</ul>
			</div>


		</>
	)
}