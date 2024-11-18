import React from "react";
import "./App.sass"
import { icon_close } from "./icons.jsx";
import { DateSelect } from "./components/DateSelect.jsx";
import { TouristCounter } from "./components/TouristCounter.jsx";
import { Phone } from "./components/Phone.jsx";
import { store } from "./store.js";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
export const App = () => {

	store.subscribe(_ => console.log(store.getState()))
	
	return (
		<dialog open>

			<div className="head">
				<span>Заявка</span>
				<button className="close">{icon_close}</button>
			</div>

			<div className="body">
				<span className="title">Киты, вулканы</span>
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

	const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

	const onSubmit = async (data) => {
		
		let obj = {
			name: data.name,
			email: data.email,
			code,
			smsid,
			num,
			date,
			adult,
			child,
			need_callback: data.cb,
			comment: data.comment
		}

		console.log(obj)

	}

	return verified
		? <form className="columns" onSubmit={handleSubmit(onSubmit)}>
				<ColumnsContent
					register={register}
					verified={verified}
					errors={errors}
				/>
			</form>
		: <div className="columns">
				<ColumnsContent
					register={register}
					verified={verified}
					errors={errors}
				/>
			</div>

		// замена <div> на <form> потому что не может быть 2х вложенных <form>
	


}

const ColumnsContent = ({register, verified, errors}) =>{


	return(
		<>
			<div className="col col-1">

				<DateSelect />
				<TouristCounter />

			</div>

			<div className="col col-2">

			<input type="text" placeholder="Ваше имя" name="name" {...register("name", { required: true })}/>
				{errors?.name ? <span className="name_error">Введите имя</span>: "" }

			<input type="email" placeholder="Ваша электронная почта" name="email" {...register("email", { required: true })}/>
			{errors?.email ? <span className="email_error">Не может быть пустым</span>: "" }
			<label>
				<span className="label">Нужен звонок менеджера</span>
				<div className="wrap">
					<input type="checkbox" defaultChecked="true" {...register('cb')}/>
					<span className="s"></span>
					<span className="l">Да</span>
				</div>
			</label>

			<Phone />

			</div>
			<div className="col col-3">
			<textarea placeholder="Ваш вопрос или комментарий для менеджера тура" {...register("comment")}></textarea>
			<div className="policy">
				<input type="checkbox" defaultChecked="true" />
				<span className="s"></span>
				<span className="l">Я согласен с <a href="/assets/policy.pdf" target="_blank">политикой обработки персональных данных</a></span>
			</div>

			<button type="submit" disabled={!verified}>Отправить</button>

			</div>		
		</>
	)
}


