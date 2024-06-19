import { qs } from "../libs";
import { swipers } from "./swipers";

export async function Ui(){

	swipers()

	await masonry.load()
	masonry.init()
	
}

const masonry = {

	async load(){

	return new Promise(resolve => {

		let grid_wrapper = qs('.blog-page .grid')
		if(!grid_wrapper) return
		
		if(qs('[msr]')) resolve()

		let script = document.createElement('script')
		script.src = "/vendors/masonry.pkgd.min.js"
		script.setAttribute('msr','')

		qs('.scripts-area').appendChild(script)
		script.onload = () => resolve()

	})
	
	},
	init(){
		let grid_wrapper = qs('.blog-page .grid')
		if(!grid_wrapper) return
		if(window.innerWidth <= 480){console.log('do not init masonry');return}
		
		var msnry = new Masonry( grid_wrapper, {
			itemSelector: '.grid-item',
			columnWidth: 273,
			gutter: 16
		});
	}
}