import React from "react";
import "./App.sass"
import { icon_chevron, icon_close, icon_minus, icon_plus } from "./icons.jsx";
import { DateSelect } from "./components/DateSelect.jsx";

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

						<div className="counter">
							<div className="row a">
								<span className="title">Взрослых</span>
								<div className="wrap">
									<button className="down" type="button">{icon_minus}</button>
									<input type="number" defaultValue="1" />
									<button className="up" type="button">{icon_plus}</button>
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