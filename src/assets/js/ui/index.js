import { fancy, qs, qsa } from "../libs";
import { swipers } from "./swipers";

export async function Ui(){

	swipers()

	filter_tours()

	await masonry.load() && masonry.init()

	await fancy.load() && fancy.init()

	// выпадающий список туров на странице отзывов
	reviews_page_dropdown_list()
	// разворачивание комментария
	reviews_page_collapse_review()

	// страница тура. выпадающий список с датами у формы
	tour_page_form_dropdown()
	
	tour_page_transfer_elements()

	
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
function reviews_page_collapse_review(){
	const buttons = qsa('.reviews-list button.collapse')
	if(!buttons) return

	buttons.forEach(button => {
		button.listen("click", e => {
			e.target.closest('li').classList.toggle('closed')
		})
	})
}

function tour_page_form_dropdown() {
	let dd = qs('.tour-page form .date .select .head')
	dd.listen("click", e => dd.closest('.select').classList.toggle('open'))
}

function tour_page_transfer_elements(){
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
}