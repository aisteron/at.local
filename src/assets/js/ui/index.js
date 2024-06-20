import { fancy, qs, qsa } from "../libs";
import { swipers } from "./swipers";

export async function Ui(){

	swipers()

	filter_tours()

	await masonry.load() && masonry.init()

	await fancy.load() && fancy.init()

	// выпадающий список туров на странице отзывов
	reviews_page_dropdown_list()

	
}

const masonry = {

	async load(){

	return new Promise(resolve => {
		
		let grid_wrapper = qs('.blog-page .grid')
		if(!grid_wrapper) resolve(false)
		
		if(qs('[msr]')) resolve(true)

		let script = document.createElement('script')
		script.src = "/vendors/masonry.pkgd.min.js"
		script.setAttribute('msr','')

		qs('.scripts-area').appendChild(script)
		script.onload = () => resolve(true)

	})
	
	},
	init(){
		let grid_wrapper = qs('.blog-page .grid')
		
		if(grid_wrapper && window.innerWidth > 480){
			new Masonry( grid_wrapper, {
				itemSelector: '.grid-item',
				columnWidth: 273,
				gutter: 16
			});
		
		}
	}
}

function filter_tours(){

	qsa("#filter li a").forEach(el => {
		
		el.listen("click",e=>{
			e.preventDefault()
			let i = qs('input', e.target.closest('label'))
			i.checked = !i.checked
		})
	})
}


function reviews_page_dropdown_list(){
	let select = qs('.select-tour')
	if(!select) return
	
	select.listen("click", () => select.classList.toggle('open'))
	
}