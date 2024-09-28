import { Fetch, declension, fancy, qs, qsa } from "../libs";
import { Dialog } from "./dialogPopup";
import { modalResponse } from "./modalResponse";
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

	modalResponse()

	// страница тура. кнопка в моб. версии
	// "оставить отзыв"

	qs('.anchor_to_form')?.listen("click", _ => {
		qs('form#review').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
	})

	
}

const masonry = {


	async init(){
		
		if(!qs('.blog-page')) return
		//await new Promise(resolve => setTimeout(resolve, 1000))
		//await this.load_imagesLoadedPlugin()
		
		imagesLoaded( qs('.grid'), async function( instance ) {

			console.log('all images are loaded');
			//await masonry.load()
			masonry.run()
		});
		

		
	},
	async load(){
		return new Promise(resolve => {
			let script = document.createElement('script')
			script.src = '/vendors/masonry.pkgd.min.js'
			script.setAttribute('msn','')
			qs('.scripts-area').appendChild(script)
			script.onload = () => resolve(true)
		})
	},
	async load_imagesLoadedPlugin(){
		return new Promise(resolve => {
			let script = document.createElement('script')
			script.src = '/vendors/imagesloaded.pkgd.min.js'
			script.setAttribute('ilp','')
			qs('.scripts-area').appendChild(script)
			script.onload = () => resolve(true)
		})
	}, 
	run(){
		let grid_wrapper = qs('.blog-page .grid')
		if(!grid_wrapper || window.innerWidth <= 480) return

		new Masonry( grid_wrapper, {
			itemSelector: '.grid-item',
			columnWidth: 273,
			gutter: 16
		});

	}
}

async function filter_tours(){

	let checked_inputs = Array.from(qsa('[data-tag]:checked')).map(el => el.dataset.tag)
	
	let selected_tags = new Set(checked_inputs || [])

	let res = await Fetch("get_filter_tours",{},"/api")
	
	qsa('[data-tag]').forEach(el => {
		el.listen('change', e => {
			
			let tag = e.target.dataset.tag
			
			e.target.checked
			? selected_tags.add(tag)
			: selected_tags.delete(tag)

			if(!selected_tags.size){
				draw_tour(res)
				return;
			}
			
			let g = res.filter(el => selected_tags.intersection(new Set(el.tags)).size)
			draw_tour(g)
		})
	})

	function draw_tour(g){
		
		let host = process.env.NODE_ENV == 'development' ? 'http://at.ashaev.by': ''
		
		let str = ``
		
		if(!g.length){
			str = `<h3>Туров не найдено</h3>`
			qs('ul.tlist').innerHTML = str
			return;
		}
		
		
		g.forEach(el => {


			
			
			let label, price,start,finish,date,monf,mons, least;

			if(el.date.length == 0){ // актуальных дат нет
				label = `<div class="label red"><span>Мест нет</span></div>`
				price = '___ ___'
				date = '___'
				least = '___'
			} else {
				label = `<div class="label yellow"><span>${el?.date?.seats} ${declension("место", "мест","места", el?.date?.seats)}</span></div>`
				price = el.date.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' '+el.currency

				start = new Date(el?.date.start)
				finish = new Date(el?.date.finish)
				date = ``
				monf = finish.getMonth() < 10 ? '0'+ (finish.getMonth()+1) : finish.getMonth()+1
				mons = start.getMonth() < 10 ? '0'+ (start.getMonth()+1) : start.getMonth()+1

				if(start.getMonth() == finish.getMonth()){
					date = `${start.getDate()} - ${finish.getDate()}.${monf}.${finish.getFullYear()}`
				} else {
					date = `${start.getDate()}.${mons} - ${finish.getDate()}.${finish.getMonth()}`
				}

				least = `+ ${el.least} ${declension("дата", "дат","даты", el.least)}`
			}



			str += `
			<li>

				${label}
				

				<img class="hero" src="${host}${el.thumb}" width="320" height="214">
				
				<div class="dsc">
					<span class="country">${el.country}</span>
					<a href="${el.uri}">${el.pagetitle}</a>
					<div class="price">
						<span class="green">${price}</span>
						<span class="duration">${el.duration} ${declension("день", "дней","дня", el.duration)}</span>
					</div>
					<div class="dates">
						<div class="actual">${date}</div>
						<div class="plan">${least}</div>
					</div>
				</div>

			</li>`
		})

		qs('ul.tlist').innerHTML = str

		// h1 innerHTML
		let c_checked = qsa('[data-tag]:checked')
	
		if(!c_checked.length || c_checked.length > 1){
			qs('h1').innerHTML = 'Путешествия'
		} else {
			let label = qs('[data-tag]:checked').dataset.title.length
				? qs('[data-tag]:checked').dataset.title
				:  qs('a', qs('[data-tag]:checked').closest('label')).innerHTML
			qs('h1').innerHTML = label
		}

	}


}

function mobile_menu_open(){



	qs('#nav-icon1')?.listen("click", e => {
		qs('header nav').classList.toggle('open')
		e.target.classList.toggle('open')
	})
}