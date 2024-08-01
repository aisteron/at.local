import { Fetch, qs, qsa } from "../libs"

export const Reviews = {
	list: [],
	init(){
		if(!qs('.reviews-page')) return

		this.dropdown_tour_select() // фильтрация отзывов по турам
		this.review_item_collapse() // сворачивание отзыва в мобильной версии
		this.get_reviews()
	},

	dropdown_tour_select(){
		let select = qs('.select-tour')
		if(!select) return
		
		// open / close
		select.listen("click", () => select.classList.toggle('open'))

		// select tour
		qsa('li[data-resid]').forEach(el => {
			el.listen("click", e => {
				let resid = +e.target.dataset.resid
				let label = e.target.innerHTML

				qs('.head span', select).innerHTML = label

				if(!this.list.length) return new Snackbar('Нет отзывов для фильтрации')
				if(resid == 0) return this.draw_review(this.list)

				this.draw_review(this.list.filter(el => el.tourid == resid))


			})
		})

	},

	draw_review(arr){

		console.log(arr)
		

	},

	async get_reviews(){
		let res;

		try {
			res = await Fetch('get_reviews',{},'/api')
		} catch(e){
			new Snackbar(e)
			//console.log(e)
		}

		if(!res) return
		this.list = res

	},

	review_item_collapse(){
		const buttons = qsa('.reviews-list button.collapse')
		if(!buttons) return

		buttons.forEach(button => {
			button.listen("click", e => {
				e.target.closest('li').classList.toggle('closed')
			})
		})
	}

}
