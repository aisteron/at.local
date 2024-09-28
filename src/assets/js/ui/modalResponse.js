import { qs } from "../libs";

export function modalResponse(){
	
	// close
	[qs('#modalResponse .head .close'),qs('#modalResponse .body .hide')].forEach(el => {
		el?.listen("click", _ => qs('#modalResponse').close())
	})

	// listen event to open
	document.listen("modalResponse_open", e => {
		qs('#tourOrderPopup').close() 
		
		let obj = e.detail
		qs('#modalResponse .head span').innerHTML = obj.title
		qs('#modalResponse .body .icon').classList.add(obj.success ? 'success' : 'error')
		qs('#modalResponse .body .header').innerHTML = obj.header
		qs('#modalResponse .body .dsc').innerHTML = obj.txt
		
		qs('#modalResponse').show()
	})
}
