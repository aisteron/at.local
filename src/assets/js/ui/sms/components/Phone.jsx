import React, { useEffect, useRef, useState } from "react";
import { Fetch } from "../../../libs";
import { InputMask } from '@react-input/mask';
import { Controller, useForm } from "react-hook-form";
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from "react-redux";
import { set_attempt, set_num, set_verified } from "../store";

export const Phone = () => {

	const [smsId, setSmsId] = useState(null)
	const [sent, setSent] = useState(false)
	const verified = useSelector(state => state.verified)


	if (verified) return <VerifiedInput />

	return sent
		? <SendCodeForm setSent={setSent} smsId={smsId} />
		: <SendPhoneForm setSent={setSent} setSmsId={setSmsId} />



}

const SendPhoneForm = ({ setSent, setSmsId }) => {

	const num = useSelector(state => state.num)
	const dispatch = useDispatch()
	const { handleSubmit, control, setError, formState: { errors, isValid, isSubmitting }, watch } = useForm({
		defaultValues: {
			phone_number: num || ''
		}
	})

	const onSubmit = async (data) => {

		dispatch(set_num(data.phone_number))

		let num = data.phone_number.replaceAll("-", "").replaceAll(" ", "").replace(")", "").replace("(", "").replace("+", "")
		let res = await Fetch('send_sms', { phone_number: num }, "/assets/sms/")

		if (res.status == "ERROR") {
			setError("phone_number", { type: "custom", message: "Ошибка" })
		} else {

			setSent(true)
			setSmsId(res.sms_id)
		}

	}

	const PhoneError = () => {

		if (isEmpty(errors)) return

		switch (errors.phone_number.type) {
			case 'required':
				return <p role="alert">Введите номер телефона</p>
			case 'pattern':
				return <p role="alert">{errors.phone_number.message}</p>

			case 'custom':
				return <p role="alert"><span >Ошибка.</span> Попробуйте позже или напишите нам в <a href="https://api.whatsapp.com/send?phone=79857737282" target="_blank">WhatsApp</a></p>

		}

	}

	return (
		<form className="phone" onSubmit={handleSubmit(onSubmit)}>

			<Controller
				control={control}
				name="phone_number"
				rules={{
					required: true,
					pattern: {
						value: /(\+7)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/,
						message: "Проверьте номер телефона"
					}
				}}
				render={({ field: { onChange, onBlur, value, ref } }) => (

					<InputMask
						mask="+7 (___) ___-__-__"
						replacement={{ _: /\d/ }}
						type="tel"
						onChange={onChange}
						onBlur={onBlur}
						showMask="1"
						disabled={isSubmitting}
						defaultValue={num}
					/>


				)}
			/>

			<PhoneError />

			<button className="send_code" type="submit">Получить код из СМС</button>
		</form>
	)


}

const SendCodeForm = ({ setSent, smsId }) => {

	const [timerExpired, setTimerExpired] = useState(false)
	const attempt = useSelector(state => state.attempt)

	const formRef = useRef(null)
	const { handleSubmit, control, setError, formState: { errors, isValid, isSubmitting }, watch } = useForm()
	const dispatch = useDispatch()

	useEffect(() => {
		const { unsubscribe } = watch((input) => {

			if (input.code.match(/\d\s\d\s\d\s\d/)) {
				// при вводе 4х цифр срабатывает автоотправка формы
				onSubmit(input)
			}
		})
		return () => unsubscribe()
	}, [watch])

	const onSubmit = async (data) => {

		console.log(data)

		let code = data.code.replaceAll(' ', '');
		let res = await Fetch("verify_code", { code, smsid: smsId }, '/assets/sms/')
		if (res.success) {
			dispatch(set_verified({ verified: true, code, smsid: smsId }))

			const sms_ok_event = new CustomEvent("sms_ok", { detail: { name: "cat" } });

			document.dispatchEvent(sms_ok_event)

		} else {
			setError("code", { type: "custom", message: "Ошибка проверки" })
		}

	}

	//console.log(timerExpired, attempt)

	let expired =
		!attempt
			? <p className="expired"><span className="again" onClick={() => { setSent(false); dispatch(set_attempt(1)) }}>Отправить повторно</span> или написать администратору через <a href="https://api.whatsapp.com/send?phone=79857737282" target="_blank">WhatsApp</a></p>
			: <p className="expired">Не приходит код? Написать администратору через <a href="https://api.whatsapp.com/send?phone=79857737282" target="_blank">WhatsApp</a></p>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="formCode" ref={formRef}>

			{(!timerExpired && !attempt) || (!timerExpired && attempt)
				?
				<Controller
					control={control}
					name="code"
					rules={{
						required: true,
						pattern: {
							value: /\d\s\d\s\d\s\d/,
							message: "Должно быть 4 цифры"
						}
					}}
					render={({ field: { onChange, onBlur, value, ref } }) => (

						<InputMask
							mask="_ _ _ _"
							replacement={{ _: /\d/ }}
							type="tel"
							onChange={onChange}
							onBlur={onBlur}
							showMask="1"
							className="inputCode"
							disabled={isSubmitting}
						/>
					)}
				/>

				: null}

			{errors.code ? <span className="error">{errors.code.message} {errors.code.type == 'required' ? 'Введите код' : ''}</span> : ''}

			{timerExpired
				? expired
				: <Timer setTimerExpired={setTimerExpired} />
			}

		</form>
	)
}

const Timer = ({ setTimerExpired }) => {

	const renderer = ({ minutes, seconds, completed }) => {

		if (completed) {
			setTimeout(() => setTimerExpired(true), 100)
			return ('');
		} else {
			// Render a countdown
			return <span>0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>;
		}
	};

	let timer = process.env.NODE_ENV == 'development' ? 50000 : 59000

	return (
		<Countdown
			date={Date.now() + timer}
			renderer={renderer}
		/>
	)
}

function isEmpty(obj) {
	for (const prop in obj) {
		if (Object.hasOwn(obj, prop)) {
			return false;
		}
	}

	return true;
}

const VerifiedInput = () => {
	const num = useSelector(store => store.num)
	return (
		<section className="verified_num">
			<input type="text" className="verified" disabled defaultValue={num} />
			<span>Номер проверен</span>
		</section>
	)
}