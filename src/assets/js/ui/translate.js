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

			document.cookie = `googtrans=/ru/${lng}`;
			if(lng == 'ru') document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			window.location.reload();

		})
	})
}

function getCookieValue(name) {
	const regex = new RegExp(`(^| )${name}=([^;]+)`)
	const match = document.cookie.match(regex)
	if (match) { return match[2]}
}