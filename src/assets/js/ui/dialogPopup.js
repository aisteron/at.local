import { qs, qsa } from "../libs"

export const Dialog = {
	async init(){
		this.open()
		this.select_date(),
		this.pick_count()
		this.open_select_flag()
		await this.load_inputmask_plugin()
		this.apply_inputmask()
		
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
		
	},

	open_select_flag(){
		
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
				var im = new Inputmask(rule.replaceAll("_",9))
				let i = qs('#tourOrderPopup .mask .head input')
				i.value = ''
				i.setAttribute('placeholder', rule)
				im.mask(i);

				qs('#tourOrderPopup .mask').classList.remove('open')


			})
		})
	},

	async load_inputmask_plugin(){
		return new Promise(resolve => {
			if(qs('[im]')) resolve()
			let script = document.createElement('script')
			script.src="/vendors/inputmask.min.js"
			script.setAttribute("im",'')
			qs('.scripts-area').appendChild(script)
			script.onload = () => resolve()
		})
		
	},

	apply_inputmask(){
		
		// default 'RU' init
		let i = qs('#tourOrderPopup .mask .head input')
		var im = new Inputmask("+7 (999) - 999 - 99 - 99");
		im.mask(i);


	}

}
