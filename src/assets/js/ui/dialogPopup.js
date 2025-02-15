import { GKEY } from "../../../../deploy/recaptcha"
import { Fetch, declension, qs, qsa } from "../libs"

export const Dialog = {
	async init() {

		if (!qs('#tourOrderPopup')) return

		this.close()
		this.select_date(),
			this.pick_count()
		this.open_select_flag()
		this.load_inputmask_plugin()
			.then(_ => this.apply_inputmask())

		this.listeners()
		this.to_server()

	},


	close() {


		qs('#tourOrderPopup button.close')?.listen("click", e => {
			qs('#tourOrderPopup').close()
		})
	},

	select_date() {

		qs('#tourOrderPopup .select .head')?.listen("click", e => {
			e.target.closest('.select').classList.toggle('open')
		})

		// pick date
		qsa('#tourOrderPopup .select ul.body li').forEach(el => {

			el.listen("click", e => {
				if (e.target.classList.contains('disabled')) return
				let obj = {
					date: qs('span:first-child', e.target).innerHTML,
					seats: qs('.seats', e.target).innerHTML,
					price: qs('.price', e.target).innerHTML
				}

				let head = qs('#tourOrderPopup .select .head')

				qs('.date span', head).innerHTML = obj.date
				qs('.seats', head).innerHTML = obj.seats
				qs('.price', head).innerHTML = obj.price

				e.target.closest('.select').classList.toggle('open')


			})
		})

	},

	pick_count() {

		let c = qs('#tourOrderPopup .count');
		[...qsa('button.up', c), ...qsa('button.down', c)].forEach(el => {
			el.listen("click", e => {
				let row = e.target.closest('.row')
				let input = qs('input', row)

				if (e.target.classList.contains('down') && input.value == 0) return
				input.value = e.target.classList.contains('up')
					? +input.value + 1
					: +input.value - 1
			})
		})

	},

	open_select_flag() {

		let flag = qs('#tourOrderPopup .mask .head .f')

		flag?.listen("click", e => {
			e.target.closest(".mask").classList.toggle("open")
		})

		// select flag

		qsa('#tourOrderPopup .mask ul.body li').forEach(el => {

			el.listen("click", e => {

				// flag

				let flag = qs('svg', e.target).cloneNode(true)
				let head = qs('#tourOrderPopup .mask .head')

				qs('.f svg.f', head).remove()

				qs('.f', head).insertBefore(flag, qs('.triangle', head))
				qs('.f svg', head).classList.add('f')

				// rule

				let rule = qs('span', e.target).innerHTML
				var im = new Inputmask(rule.replaceAll("_", 9))
				let i = qs('#tourOrderPopup .mask .head input')
				i.value = ''
				i.setAttribute('placeholder', rule)
				im.mask(i);

				qs('#tourOrderPopup .mask').classList.remove('open')


			})
		})
	},

	async load_inputmask_plugin() {
		return new Promise(resolve => {
			if (qs('[im]')) resolve()
			let script = document.createElement('script')
			script.src = "/vendors/inputmask.min.js"
			script.setAttribute("im", '')
			qs('.scripts-area').appendChild(script)
			script.onload = () => resolve(true)
		})

	},

	apply_inputmask() {

		// default 'RU' init
		let i = qs('#tourOrderPopup .mask .head input')
		var im = new Inputmask("+7 (999) - 999 - 99 - 99");
		i ? im.mask(i) : console.log('input mask can not be applied!')



	},

	listeners() {

		// выбранная дата из формы

		document.addEventListener("update_for_dialog", e => {

			let o = e.detail


			// tour
			// count
			// cur

			let start = new Date(o.tour.start).toLocaleDateString()
			let finish = new Date(o.tour.finish).toLocaleDateString()
			let d = declension("место", "мест", "места", o.tour.seats)
			let p = o.tour.price.replace(/\B(?=(\d{3})+(?!\d))/g, " ")

			qs('#tourOrderPopup .select .head .date span').innerHTML = `${start} - ${finish}`
			qs('#tourOrderPopup .select .head .dsc .seats').innerHTML = `${o.tour.seats} ${d}`
			qs('#tourOrderPopup .select .head .dsc .price').innerHTML = `${p} ${o.cur}`

			qs('#tourOrderPopup .row.adult input').value = o.count



		})
	},

	to_server() {
		const submit_button = qs('#tourOrderPopup button[type="submit"]')

		// валидация recaptcha
		qs('#tourOrderPopup form').listen("submit", e => {
			e.preventDefault()

			submit_button.disabled = true

			if (process.env.NODE_ENV == 'development') {
				send()
			} else {
				grecaptcha.ready(function () {
					grecaptcha.execute(GKEY.public, { action: 'submit' })
						.then(async function (token) {
							let res = await Fetch("verify_recaptcha", { token: token }, '/api')
							if (res.score < 0.5) return new Snackbar("Ошибка проверки recaptcha. Пожалуйста, попробуйте позже");

							send(res)
						});
				});

			}




		})


		async function send() {


			let obj = {
				action: 'order_receive',
				name: qs('#tourOrderPopup [name="username"]').value,
				email: qs('#tourOrderPopup [name="email"]').value,
				phone: qs('#tourOrderPopup [inputmode]').value,
				adult: qs('#tourOrderPopup .row.adult input').value,
				child: qs('#tourOrderPopup .row.child input').value,
				tour_name: qs('#tourOrderPopup span.title').innerHTML,
				tour_date: qs('#tourOrderPopup .select .head .date span').innerHTML,
				seats: qs('#tourOrderPopup .select .head .dsc .seats').innerHTML,
				price: qs('#tourOrderPopup .select .head .dsc .price').innerHTML,
				ncb: qs('#tourOrderPopup .ncb input').checked,
				comment: qs('#tourOrderPopup textarea').value
			}


			try {
				var res = await Fetch('order_receive', obj, '/api')
			} catch (e) {
				console.log(e)
				return new Snackbar('❌ Сервер: ошибка отправки')
			}

			if (!res?.success) {
				return new Snackbar('❌ Клиент: ошибка отправки заказа')
			}

			submit_button.disabled = false


			// open modalResponse.js

			let modalObj = {
				success: true,
				title: 'Заявка',
				header: 'Ваша заявка получена',
				txt: 'Мы свяжемся с вами в ближайшее время'
			}

			let ev = new CustomEvent("modalResponse_open", { detail: modalObj })
			document.dispatchEvent(ev)




			qs('#tourOrderPopup form').reset()

			// кастомный инвент, чтобы метрика в libs.js услышала
			const catFound = new CustomEvent("tourOrderPopup_send", {
				detail: { name: "cat" },
			});

			document.dispatchEvent(catFound)

		}
	}




}
