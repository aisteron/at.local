import { qs, qsa } from "../libs"

export const Dialog = {
	init(){
		this.open()
		this.select_date(),
		this.pick_count()
	},

	open(){

		qs('form#aside_order')?.listen("submit", e=> e.preventDefault())

		qs('form#aside_order button[type="submit"]')?.listen("click", e => {
			qs('#tourOrderPopup')?.showModal()
		})

		// close
		qs('#tourOrderPopup button.close')?.listen("click", e => {
			qs('#tourOrderPopup').close()
		})
	},

	select_date(){

		qs('#tourOrderPopup .select .head').listen("click",e  => {
			e.target.closest('.select').classList.toggle('open')
		})

		// pick date
		qsa('#tourOrderPopup .select ul.body li').forEach(el => {

			el.listen("click",e => {
				if(e.target.classList.contains('disabled')) return
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

	pick_count(){
		
		let c = qs('#tourOrderPopup .count');
		[...qsa('button.up', c), ...qsa('button.down', c)].forEach(el => {
			el.listen("click", e => {
				let row = e.target.closest('.row')
				let input = qs('input',row)
				
				if(e.target.classList.contains('down') && input.value == 0) return
				input.value = e.target.classList.contains('up')
				? +input.value+1
				: +input.value-1
			})
		})
		
	}

}
