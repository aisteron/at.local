import React from "react";
import "./App.sass"
import { icon_close } from "./icons.jsx";
import { DateSelect } from "./components/DateSelect.jsx";
import { TouristCounter } from "./components/TouristCounter.jsx";

export const App = () => {
	return (
		<dialog open>

			<div className="head">
				<span>Заявка</span>
				<button className="close">{icon_close}</button>
			</div>
			<div className="body">
				<span className="title">Киты, вулканы</span>
				<form className="columns">
					<div className="col col-1">

						<DateSelect />
						<TouristCounter />


					</div>
					<div className="col col-2">
						<input type="text" placeholder="Ваше имя" name="name" required />
						<input type="email" placeholder="Ваша электронная почта" name="email" required />
						<label>
							<span className="label">Нужен звонок менеджера</span>
							<div className="wrap">
								<input type="checkbox" defaultChecked="true" />
								<span className="s"></span>
								<span className="l">Да</span>
							</div>
						</label>
						<div className="phone">
							<input type="tel" placeholder="+7" required />
							<button className="send_code">Получить код из СМС</button>
						</div>
					</div>
					<div className="col col-3">
						<textarea placeholder="Ваш вопрос или комментарий для менеджера тура"></textarea>
						<div className="policy">
							<input type="checkbox" defaultChecked="true" />
							<span className="s"></span>
							<span className="l">Я согласен с <a href="#">политикой обработки персональных данных</a></span>
						</div>

						<button type="submit" disabled>Отправить</button>

					</div>
				</form>
			</div>
		</dialog>
	)
}