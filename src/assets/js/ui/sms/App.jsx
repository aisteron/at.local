import React from "react";
import "./App.sass"
import { icon_close } from "./icons.jsx";
import { DateSelect } from "./components/DateSelect.jsx";
import { TouristCounter } from "./components/TouristCounter.jsx";
import { Phone } from "./components/Phone.jsx";
import { store, set_show } from "./store.js";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Fetch, qs } from "../../libs.js";
import { GKEY } from "../../../../../deploy/recaptcha.js";

export const App = () => {

	process.env.NODE_ENV == 'development' && store.subscribe(_ => console.log(store.getState()))
	const show = useSelector(state => state.show)
	const dispatch = useDispatch()
	return (
		<dialog open={show}>

			<div className="head">
				<span>Заявка</span>
				<button className="close" onClick={_ => dispatch(set_show(false))}>{icon_close}</button>
			</div>

			<div className="body">
				<span className="title">{qs('h1').innerHTML}</span>
				<Columns />
			</div>
		</dialog>
	)
}

const Columns = () => {

	const verified = useSelector(state => state.verified)
	const code = useSelector(state => state.code)
	const smsid = useSelector(state => state.smsid)
	const num = useSelector(state => state.num)
	const date = useSelector(state => state.date)
	const adult = useSelector(state => state.adult)
	const child = useSelector(state => state.child)
	const dispatch = useDispatch()

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm()

	const onSubmit = async (data) => {

		let is_dev = process.env.NODE_ENV == 'development'
		let tour_date = new Date(date.start).toLocaleDateString() + " - " + new Date(date.finish).toLocaleDateString()


		let obj = {
			name: data.name,
			surname: data.surname,
			thirdname: data.thirdname,
			email: data.email,
			phone: num,
			adult,
			child,
			code,
			smsid,
			ncb: data.cb,
			comment: data.comment,
			tour_name: qs('h1').innerHTML,
			tour_date: tour_date,
			seats: date.seats,
			price: date.price + ' ' + date.currency,

			clientid: get_cookies()['_ym_uid'],
			tour_start: date.start,
			action: "order_receive_sms"

		}

		if (sessionStorage.getItem("campaign")) obj.campaign = sessionStorage.getItem("campaign")
		if (sessionStorage.getItem("source")) obj.source = sessionStorage.getItem("source")


		if (!is_dev) {
			if (!await google_check()) return console.log('google check failed')
		}

		try {
			var res = await Fetch('order_receive_sms', obj, '/api')
		} catch (e) {
			console.log(e)
			return new Snackbar('❌ Сервер: ошибка отправки')
		}

		if (!res?.success) {
			return new Snackbar('❌ Клиент: ошибка отправки заказа')
		}

		dispatch(set_show(false))

		let modalObj = {
			success: true,
			title: 'Заявка',
			header: 'Ваша заявка получена',
			txt: 'Мы свяжемся с вами в ближайшее время'
		}

		let ev = new CustomEvent("modalResponse_open", { detail: modalObj })
		document.dispatchEvent(ev)

		// кастомный инвент, чтобы метрика в libs.js услышала
		const catFound = new CustomEvent("tourOrderPopup_send", {
			detail: { name: "cat" },
		});

		document.dispatchEvent(catFound)

	}

	return verified
		? <form className="columns" onSubmit={handleSubmit(onSubmit)}>
			<ColumnsContent
				register={register}
				verified={verified}
				errors={errors}
				isSubmitting={isSubmitting}
			/>
		</form>
		: <div className="columns">
			<ColumnsContent
				register={register}
				verified={verified}
				errors={errors}
				isSubmitting={isSubmitting}
			/>
		</div>

	// замена <div> на <form> потому что не может быть 2х вложенных <form>



}

const ColumnsContent = ({ register, verified, errors, isSubmitting }) => {


	return (
		<>
			<div className="col col-1">

				<DateSelect />
				<TouristCounter />

			</div>

			<div className="col col-2">

				<div className="fio">

					<div className="surname">
						<input type="text" placeholder="Фамилия" {...register("surname", { required: true })} />
						{errors?.surname ? <span className="name_error">Введите фамилию</span> : ""}
					</div>

					<div className="name">
						<input type="text" placeholder="Имя" {...register("name", { required: true })} />
						{errors?.name ? <span className="name_error">Введите имя</span> : ""}
					</div>
					<div className="thirdname">
						<input type="text" placeholder="Отчество" {...register("thirdname")} />
						{errors?.thirdname ? <span className="name_error">Введите отчество</span> : ""}
					</div>

				</div>




				<label>
					<span className="label">Нужен звонок менеджера</span>
					<div className="wrap">
						<input type="checkbox" defaultChecked="true" {...register('cb')} />
						<span className="s"></span>
						<span className="l">Да</span>
					</div>
				</label>

				<Phone />

			</div>
			<div className="col col-3">
				<input type="email" placeholder="Ваша электронная почта" name="email" {...register("email", { required: true })} />
				{errors?.email ? <span className="email_error">Не может быть пустым</span> : ""}
				<textarea placeholder="Ваш вопрос или комментарий для менеджера тура" {...register("comment")}></textarea>
				<div className="policy">
					<input type="checkbox" defaultChecked="true" />
					<span className="s"></span>
					<span className="l">Я согласен с <a href="/assets/policy.pdf" target="_blank">политикой обработки персональных данных</a></span>
				</div>

				<button type="submit" disabled={!verified || isSubmitting}>Отправить</button>

			</div>
		</>
	)
}

async function google_check() {
	return new Promise(resolve => {
		grecaptcha.ready(function () {
			grecaptcha.execute(GKEY.public, { action: 'submit' })
				.then(async function (token) {
					let res = await Fetch("verify_recaptcha", { token: token }, '/api')

					if (res.score < 0.5) {
						resolve(false)
						return new Snackbar("Ошибка проверки recaptcha. Пожалуйста, попробуйте позже");
					} else {
						resolve(true)
					}


				});
		});
	})
}

function get_cookies() {
	return document.cookie.split(';').reduce((ac, str) => Object.assign(ac, { [str.split('=')[0].trim()]: str.split('=')[1] }), {});
}
