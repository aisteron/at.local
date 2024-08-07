import { fancy, qs, qsa } from "../libs";
import { Dialog } from "./dialogPopup";
import { swipers } from "./swipers";

export async function Ui(){

	swipers()

	filter_tours()

	// страница блога
	masonry.init()

	await fancy.load() && fancy.init()


	// открыть мобильно меню
	mobile_menu_open()

	// диалоговое окно
	Dialog.init()

	
}

const masonry = {


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

function mobile_menu_open(){



	qs('#nav-icon1').listen("click", e => {
		qs('header nav').classList.toggle('open')
		e.target.classList.toggle('open')
	})
}