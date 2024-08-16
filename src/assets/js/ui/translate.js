import { qs, qsa } from "../libs"

export function translate(){
	let clang = getCookieValue('googtrans')

	if(clang){
		let c = clang.split("/")[2]
		qsa('[data-lang]').forEach(el => el.classList.remove('active'))
		qs(`[data-lang="${c}"]`).classList.add('active')
	}
	
	qsa('[data-lang]').forEach(el => {
		
		el.listen("click", e => {

			let lng = e.target.dataset.lang

			lng == 'ru'
				? removeC()
				:(removeC(), Cookies.set('googtrans', `/ru/${lng}`,{path:"/", domain:"."+document.domain}))
					
			window.location.reload();

		})
	})
}

function removeC(){

	let clang = getCookieValue('googtrans')
	let c = clang?.split("/")[2]

	Cookies.remove('googtrans',{path:"/", domain:"."+document.domain})
	Cookies.remove('googtrans',{path:"/", domain:".ashaev.by"})
	Cookies.remove('googtrans', `/ru/${c}`,{path:"/", domain:".ashaev.by"})

	Cookies.remove('googtrans',{path:"/", domain:".adventuretime.pro"})
	Cookies.remove('googtrans', `/ru/${c}`,{path:"/", domain:".adventuretime.pro"})
}

function getCookieValue(name) {
	const regex = new RegExp(`(^| )${name}=([^;]+)`)
	const match = document.cookie.match(regex)
	if (match) { return match[2]}
}