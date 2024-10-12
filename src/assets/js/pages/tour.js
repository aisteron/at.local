import { Fetch, qs, qsa, sw } from "../libs"

export const Tour = {

	init() {

		if (!qs('.tour-page')) return

		aside_form.init() // форма заказа тура


		this.transfer_elements()

		this.add_favorite() // добавить в избранное

		this.top_gallery_mobile_lazy() // ленивая загрузка для мобильной галереи
		this.expand_content() // разворачивание контента

		this.expand_program() // блок программа тура

		this.expand_hotels() // блок проживания (гостиницы)

		this.expand_faq() // блок часто задаваемых вопросов

		this.send_pdf()


		this.share() // поделиться ссылкой

		this.floating_anchors() // scroll in View



	},

	add_favorite() {

		const outline = `<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10 19.0004L8.55 17.7004C6.86667 16.1837 5.475 14.8754 4.375 13.7754C3.275 12.6754 2.4 11.6879 1.75 10.8129C1.1 9.93789 0.645833 9.13372 0.3875 8.40039C0.129167 7.66706 0 6.91706 0 6.15039C0 4.58372 0.525 3.27539 1.575 2.22539C2.625 1.17539 3.93333 0.650391 5.5 0.650391C6.36667 0.650391 7.19167 0.833724 7.975 1.20039C8.75833 1.56706 9.43333 2.08372 10 2.75039C10.5667 2.08372 11.2417 1.56706 12.025 1.20039C12.8083 0.833724 13.6333 0.650391 14.5 0.650391C16.0667 0.650391 17.375 1.17539 18.425 2.22539C19.475 3.27539 20 4.58372 20 6.15039C20 6.91706 19.8708 7.66706 19.6125 8.40039C19.3542 9.13372 18.9 9.93789 18.25 10.8129C17.6 11.6879 16.725 12.6754 15.625 13.7754C14.525 14.8754 13.1333 16.1837 11.45 17.7004L10 19.0004ZM10 16.3004C11.6 14.8671 12.9167 13.6379 13.95 12.6129C14.9833 11.5879 15.8 10.6962 16.4 9.93789C17 9.17956 17.4167 8.50456 17.65 7.91289C17.8833 7.32122 18 6.73372 18 6.15039C18 5.15039 17.6667 4.31706 17 3.65039C16.3333 2.98372 15.5 2.65039 14.5 2.65039C13.7167 2.65039 12.9917 2.87122 12.325 3.31289C11.6583 3.75456 11.2 4.31706 10.95 5.00039H9.05C8.8 4.31706 8.34167 3.75456 7.675 3.31289C7.00833 2.87122 6.28333 2.65039 5.5 2.65039C4.5 2.65039 3.66667 2.98372 3 3.65039C2.33333 4.31706 2 5.15039 2 6.15039C2 6.73372 2.11667 7.32122 2.35 7.91289C2.58333 8.50456 3 9.17956 3.6 9.93789C4.2 10.6962 5.01667 11.5879 6.05 12.6129C7.08333 13.6379 8.4 14.8671 10 16.3004Z" fill="#32A95E" />
			</svg>`
		const filled = `<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10 19.0004L8.55 17.7004C6.86667 16.1837 5.475 14.8754 4.375 13.7754C3.275 12.6754 2.4 11.6879 1.75 10.8129C1.1 9.93789 0.645833 9.13372 0.3875 8.40039C0.129167 7.66706 0 6.91706 0 6.15039C0 4.58372 0.525 3.27539 1.575 2.22539C2.625 1.17539 3.93333 0.650391 5.5 0.650391C6.36667 0.650391 7.19167 0.833724 7.975 1.20039C8.75833 1.56706 9.43333 2.08372 10 2.75039C10.5667 2.08372 11.2417 1.56706 12.025 1.20039C12.8083 0.833724 13.6333 0.650391 14.5 0.650391C16.0667 0.650391 17.375 1.17539 18.425 2.22539C19.475 3.27539 20 4.58372 20 6.15039C20 6.91706 19.8708 7.66706 19.6125 8.40039C19.3542 9.13372 18.9 9.93789 18.25 10.8129C17.6 11.6879 16.725 12.6754 15.625 13.7754C14.525 14.8754 13.1333 16.1837 11.45 17.7004L10 19.0004Z" fill="#32A95E" />
			</svg>`

		let fav = qs('.tour-page .share .fav')
		let resid = +qs('[resid]')?.getAttribute('resid')


		let fls = localStorage.getItem('favorite')
		fls = new Set(fls ? fls.split(",").map(el => +el) : [])
		fls.has(resid) && (fav.innerHTML = filled)

		fav?.listen("click", e => {
			fls.has(resid)
				? (fls.delete(resid), fav.innerHTML = outline)
				: (fls.add(resid), fav.innerHTML = filled)

			localStorage.setItem('favorite', Array.from(fls).join(','))

		})

	},
	transfer_elements() {
		let script = document.createElement('script')
		script.src = "/vendors/transfer-elements.min.js"
		qs('.scripts-area').appendChild(script)

		script.onload = () => {

			new TransferElements(
				{
					sourceElement: qs('aside form'),
					breakpoints: {
						1010: {
							targetElement: qs("#content")
						}
					}
				},
				{
					sourceElement: qs('aside .questions'),
					breakpoints: {
						1010: {
							targetElement: qs("#content"),
							targetPosition: 5
						}
					}
				}
			);
		}
	},

	floating_anchors() {
		qsa('ul.floating-anchors li a').forEach(el => {

			el.listen("click", e => {

				let anchor = e.target.href.split('#')[1]

				anchor && e.preventDefault()

				// хак для анкора #txt для мобильного вида
				if (qs('#mobile_gallery') && anchor == 'txt') return qs(`#${anchor}`).scrollIntoView({ block: 'center' });



				qs(`#${anchor}`).scrollIntoView();

			})
		})
	},

	async top_gallery_mobile_lazy() {
		if (!qs('#mobile_gallery')) return

		const swiper = qs("#mobile_gallery .swiper")

		await sw.load()
		let swi = new Swiper(swiper, {});

		swi.on('slideChange', e => {

			qs('.count .digits .current').innerHTML = e.activeIndex + 1
		});

		// lazy data-src
		qsa("#mobile_gallery [data-src]").forEach(el => {
			el.src = el.dataset.src
			el.style.height = "350px"
		})
	},
	expand_content() {
		let exp = qs('#content .expand')
		if (!exp) return

		exp.listen("click", e => {
			let cnt = e.target.closest('.cnt')
			cnt.classList.toggle('collapsed')
		})
	},
	expand_program() {
		// раскрыть все дни

		qs('#program .head .expand')?.listen("click", e => {
			qsa('#program .body ul li').forEach(el => el.classList.toggle('open'))

			e.target.classList.toggle('open')
		})

		// каждый раскрывает свое
		qsa('#program .body ul li .head').forEach(el => el.listen("click", e => {
			e.target.closest('li').classList.toggle('open')
		}))


	},
	expand_hotels() {
		qsa('#hotels ul li .head').forEach(el => {
			el.listen("click", e => {
				e.target.closest('li').classList.toggle('open')
			})
		})
	},
	expand_faq() {
		let items = qsa('#faq li .head')
		if (!items) return

		items.forEach(el => {
			el.listen("click", e => {
				e.target.closest('li').classList.toggle('open')
			})
		})
	},

	send_pdf() {
		let em = qs('#program .row .email span')
		let m = em?.closest('.email')
		if (!em) return

		em.listen("click", e => {
			m.classList.toggle('open')
		})

		document.listen("click", e => {
			if (e.target == em) return
			if (qs('form', m).contains(e.target)) return

			m.classList.remove('open')
		})

		// send
		qs('form', m).listen("submit", async e => {

			e.preventDefault()
			qs('button', m).disabled = true
			let obj = {
				action: "pdf_email_receive",
				email: qs('input', m).value,
				resid: +qs('[resid]').getAttribute('resid')
			}

			try {
				var res = await Fetch("pdf_email_receive", obj, '/api')
			} catch (e) {

				if (e.message == 'Ошибка сервера') {
					return new Snackbar('Неверный формат почты')
				}
				new Snackbar("Что-то пошло не так")
			}

			qs('button', m).disabled = false
			if (!res) return

			if (res?.success) {
				new Snackbar("✅ Успех! Проверьте, пожалуйста, свою почту")
				qs('form', m).reset()
				m.classList.remove("open")

				// кастомный инвент, чтобы метрика в libs.js услышала
				const catFound = new CustomEvent("email_send", {
					detail: { name: "cat" },
				});

				document.dispatchEvent(catFound)

			}





		})
	},

	async share() {

		let wrap = qs('#share_icon.wrap')
		let button = qs('.button', wrap)

		button?.listen("click", e => {
			wrap.classList.toggle('open')
		})

		// close by outside click
		document.listen("click", e => {
			if (e.target == button) return
			if (qs('.body', wrap).contains(e.target)) return
			wrap.classList.remove('open')
		})

		// close by swipedown

		await this.load_swiped_events()

		qs('.box', wrap)?.listen("swiped-down", _ => wrap.classList.remove('open'))

		// copy url in share button
		let link = qs('li.copy', wrap)
		qs('a', link)?.listen("click", e => e.preventDefault())
		if (link) {
			link.listen("click", _ => {
				navigator.clipboard.writeText(window.location.href)
				new Snackbar("✅ Ссылка скопирована!")
			})

		}


	},
	async load_swiped_events() {
		return new Promise((resolve) => {

			let script = document.createElement("script")
			script.src = "/vendors/swiped-events.min.js"
			script.setAttribute('se', '')
			qs(".scripts-area").appendChild(script)


			script.onload = () => resolve(true)

		})
	},



}


export const aside_form = {

	schedule: [],
	cfg: [],

	async init() {

		if (!qs('#aside_order')) return

		this.open()

		// получить расписание тура и конфиг
		await this.aside_form_fetch_schedule()
		await this.aside_form_fetch_tour_config()

		// ближайший тур с кол-вом мест > 0

		let closest_tour = this.schedule.filter(el => new Date(el.start).getTime() - new Date().getTime() > 0 && +el.seats)
		if (!closest_tour.length) { return console.log('Блишайший тур не обнаружен') }
		closest_tour = closest_tour[0]

		// делаем его активным в списке
		qs(`#aside_order li[data-id='${closest_tour.MIGX_id}']`)?.classList.add('active')


		// выпадающий список с датами

		let dd = qs('.tour-page form .date .select .head')
		dd?.listen("click", e => dd.closest('.select').classList.toggle('open'))

		// выбор даты в списке дат
		qsa('#aside_order li[data-id]').forEach(el => {
			el.listen("click", e => {
				if (e.target.classList.contains('disabled')) return
				let dateid = +e.target.dataset.id
				let selected = this.schedule.find(el => el.MIGX_id == dateid)

				let cur = this.cfg.currency == "RUB" ? "₽" : this.cfg.currency
				if (qs('#aside_order .old_price'))
					qs('#aside_order .old_price').innerHTML = selected.old_price.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
				qs('#aside_order .price').innerHTML = selected.price.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + cur

				if (selected.old_price) {
					let disc = 100 - (+selected.price / +selected.old_price) * 100
					qs('#aside_order .discount').innerHTML = `-${Math.ceil(disc)}%`

				}

				// progress

				let total = this.cfg.group_size
				let seats = +selected.seats
				let p = Math.ceil(100 - (seats / total) * 100)

				qs('.grad .filled').style.setProperty('--prog', `${p}%`)
				qs('.range .leave span').innerHTML = seats


				// active class for current

				qsa('#aside_order li[data-id]').forEach(el => el.classList.remove('active'))
				e.target.classList.add('active')

				// select .head
				let start = new Date(selected.start).toLocaleDateString()
				let finish = new Date(selected.finish).toLocaleDateString()
				qs('#aside_order .select .head').dataset.id = selected.MIGX_id
				qs('#aside_order .select .head span').innerHTML = `${start} - ${finish}`



				e.target.closest('.select').classList.remove('open')


			})
		});

		// + - кнопки кол-ва человек в форме

		let inp = qs('#aside_order .arrows input');
		[qs('#aside_order button.up'), qs('#aside_order button.down')].forEach(el => {
			el.listen("click", e => {
				let act = e.target.classList.contains('up') ? 'up' : 'down'
				if (+inp.value <= +inp.min && act == 'down') return
				inp.value = act == 'up' ? +inp.value + 1 : +inp.value - 1
			})
		})

	},

	async aside_form_fetch_schedule() {

		try {
			var res = await Fetch("get_tour_schedule", { id: +qs('[resid]').getAttribute('resid') }, "/api")
			this.schedule = res

		} catch (e) {
			console.log(e)
			return new Snackbar('❌ Ошибка ответа сервера')
		}

		if (res?.success == false) {
			return new Snackbar('⚠️ ' + res?.message || '⚠️ Ошибка получения расписания')
		}


	},

	async aside_form_fetch_tour_config() {

		try {
			let res = await Fetch("get_tour_cfg", { id: +qs('[resid]').getAttribute('resid') }, "/api")
			this.cfg = res
		} catch (e) {
			console.log(e)
			return new Snackbar('❌ Сервер: ошибка получения конфига')
		}
	},

	open() {

		qs('form#aside_order')?.listen("submit", e => e.preventDefault())

		qs('form#aside_order button[type="submit"]')?.listen("click", e => {
			qs('#tourOrderPopup')?.showModal()

			// актуализация выбранной даты в попап

			let tour = this.schedule.find(el => el.MIGX_id == +qs('.head[data-id]').dataset.id)

			const dogFound = new CustomEvent("update_for_dialog", {
				detail: {
					tour: tour,
					count: +qs('.arrows input').value,
					cur: this.cfg.currency == "RUB" ? "₽" : this.cfg.currency
				},
			});

			document.dispatchEvent(dogFound);
		})
	}

}

