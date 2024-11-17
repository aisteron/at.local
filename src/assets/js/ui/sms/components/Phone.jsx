import React, { useEffect, useRef, useState } from "react";
import { Fetch } from "../../../libs";
import { InputMask } from '@react-input/mask';
import { Controller, useForm } from "react-hook-form";
import Countdown from 'react-countdown';

export const Phone = () => {

	const [smsId, setSmsId] = useState(null)
	const [num, setNum] = useState(null)
	const [sent, setSent] = useState(false)
	const [verified, setVerified] = useState(false)

	return sent
		? <SendCodeForm setSent={setSent} smsId={smsId} setVerified={setVerified} />
		: <SendPhoneForm setSent={setSent} setSmsId={setSmsId} num={num} setNum={setNum} />



}

const SendPhoneForm = ({ setSent, setSmsId, num, setNum }) => {


	const { handleSubmit, control, setError, formState: { errors, isValid, isSubmitting }, watch } = useForm()

	const onSubmit = async (data) => {
		setNum(data.phone_number)

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
		console.log(errors)
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

const SendCodeForm = ({ setSent, smsId, setVerified }) => {
	const [sentCode, setSentCode] = useState(false)
	const [timerExpired, setTimerExpired] = useState(false)

	const formRef = useRef(null)
	const { handleSubmit, control, setError, formState: { errors, isValid, isSubmitting }, watch } = useForm()

	useEffect(() => {
		const { unsubscribe } = watch((input) => {

			if (input.code.match(/\d\s\d\s\d\s\d/)) {

				//formRef.current.submit()

				onSubmit(input)
			}
		})
		return () => unsubscribe()
	}, [watch])

	const onSubmit = async (data) => {
		await new Promise(resolve => setTimeout(() => resolve(true), 2000))
		console.log(data)

		let code = data.code.replaceAll(' ', '');
		let res = await Fetch("verify_code", { code, smsid: smsId }, '/assets/sms/')
		if (res.success) {
			setVerified(res.success)

		} else {
			setError("code", { type: "custom", message: "Ошибка проверки" })
		}

	}


	return (
		<form onSubmit={handleSubmit(onSubmit)} className="formCode" ref={formRef}>


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


			{errors.code ? <span className="error">{errors.code.message} {errors.code.type == 'required' ? 'Введите код' : ''}</span> : ''}

			{timerExpired
				? <p className="expired"> <span className="again" onClick={() => setSent(false)}>Попробовать снова</span> или написать в <a href="https://api.whatsapp.com/send?phone=79857737282" target="_blank">WhatsApp</a></p>
				: <Timer setTimerExpired={setTimerExpired} />
			}




		</form>
	)
}

const Timer = ({ setTimerExpired }) => {

	const renderer = ({ minutes, seconds, completed }) => {

		if (completed) {
			// Render a completed state
			//
			setTimeout(() => setTimerExpired(true), 100)
			return ('');
		} else {
			// Render a countdown
			return <span>0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>;
		}
	};

	return (
		// <div className="timer">00:59</div>
		<Countdown
			date={Date.now() + 5000}
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