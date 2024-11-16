import React, { useEffect, useRef, useState } from "react";
import { Fetch } from "../../../libs";
import { InputMask } from '@react-input/mask';
import { Controller, useForm } from "react-hook-form";

export const Phone = () => {

	//Fetch('action_name', { phone_number: input.current.value }, "/assets/sms/")
	const [sent, setSent] = useState(false)

	return !sent ? <SendCodeForm /> : <SendPhoneForm setSent={setSent} />


}

const SendPhoneForm = ({ setSent }) => {

	const {
		register,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		control, setError
	} = useForm({
		mode: "onChange"
	});

	const onSubmit = async (data) => {
		let num = data.phone_number.replaceAll("-", "").replaceAll(" ", "").replace(")", "").replace("(", "")
		let res = await Fetch('action_name', { phone_number: num }, "/assets/sms/")
		res = res[Object.keys(res)[0]];

		if (res.status == "ERROR") {
			setError("phone_number", { type: "custom", message: res.status_text })
		} else {
			setSent(true)
		}

	}
	console.log(errors)
	return (
		<form className="phone" onSubmit={handleSubmit(onSubmit)}>


			<InputMask mask="+7 (___) ___-__-__"
				replacement={{ _: /\d/ }}
				showMask="1" type="tel"
				{...register("phone_number", { pattern: /(\+7)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/ })}
				className={errors.phone_number ? 'error' : null}
			/>

			{errors.phone_number && <p role="alert">{errors.phone_number.message}</p>}

			<button className="send_code" type="submit">Получить код из СМС</button>
		</form>
	)
}

const SendCodeForm = () => {
	const {
		register,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		control, setError
	} = useForm({
		mode: "onChange"
	});

	const onSubmit = async (data) => {
		console.log(data)

	}
	console.log(errors)

	return (
		<form className="code" onSubmit={handleSubmit(onSubmit)}>

			<InputMask mask="_ _ _ _"
				showMask="1" type="tel"
				{...register("code", { pattern: /(\+7)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/ })}
				className={errors.code ? 'error' : null}
			/>

			{errors.code && <p role="alert">{errors.code.message}</p>}
		</form>
	)
}