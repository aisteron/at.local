import "regenerator-runtime/runtime.js";
Node.prototype.listen = Node.prototype.addEventListener;
export let doc=document,
    qsa=(s,o=doc)=>o?.querySelectorAll(s),
    qs=(s,o=doc)=>o?.querySelector(s);

export const cfg = {
	host: process.env.NODE_ENV == 'development' ? 'http://at.ashaev.by':''
}
export function loadCSS(n,e,o,d){"use strict";var t=window.document.createElement("link"),i=e||window.document.getElementsByTagName("script")[0],l=window.document.styleSheets;return t.rel="stylesheet",t.href=n,t.media="only x",d&&(t.onload=d),i.parentNode.insertBefore(t,i),t.onloadcssdefined=function(n){for(var e,o=0;o<l.length;o++)l[o].href&&l[o].href===t.href&&(e=!0);e?n():setTimeout(function(){t.onloadcssdefined(n)})},t.onloadcssdefined(function(){t.media=o||"all"}),t}

export function onloadCSS(n,e){
	n.onload=function(){
		n.onload=null,e&&e.call(n)
	},"isApplicationInstalled"in navigator&&"onloadcssdefined"in n&&n.onloadcssdefined(e);
}

export async function load_toast(){

	// https://github.com/joostlawerman/SnackbarLightjs

	// new Snackbar("Hey! Im a snackbar");

	return new Promise(resolve => {
		let script = document.createElement('script')
		script.src = '/vendors/snackbar/snackbarlight.min.js'
		qs('.scripts-area').appendChild(script)
		script.onload = () => {
			let style = loadCSS('/vendors/snackbar/snackbarlight.min.css')
			onloadCSS(style, () => {
				resolve('toast assets loaded')
			})
		}
	})
}

export async function xml(action, data, path){
  
  data && (data = JSON.stringify(data))


  return new Promise(resolve => {

		let xhr = new XMLHttpRequest();
		let body = `action=${action}${data ? `&data=`+data : ""}`

		//process.env.NODE_ENV == 'production' && (cfg.host = '')
    


		xhr.open("POST", path, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xhr.onreadystatechange = function () {

			if (this.readyState != 4) return
			resolve(this.responseText)
		}

		xhr.send(body);
	})
}

export const sw = {
	async load(){
		
		return new Promise(resolve =>{
			if(qs(['swiper'])){resolve(true); return}
			let script = document.createElement("script")
			script.src="/vendors/swiper/swiper-bundle.min.js"
			script.setAttribute("swiper","")
			qs(".scripts-area").appendChild(script)
			
			script.onload = () => {
				let style = loadCSS("/vendors/swiper/swiper-bundle.min.css")
				onloadCSS(style, () => resolve(true))
			}
		})
	},

	init(el,options){ new Swiper(el, options) }
}

export function runMetrika(number){
	if(process.env.NODE_ENV == 'development') return;
	//if(qs('#edit_panel')) return;

	// (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
	// (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
	// ym(number, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });

	
	// слушатели метрики

	// страница тура. aside. отдельно плавающие тг и вацап
	qsa('.little_float a').forEach(el => {
		el.listen("click", e => {
			//e.preventDefault()
			e.target.classList.value == 'tg'
			? reach('telegram')
			: reach('whatsapp')
		})
	});

	// страница тура. aside. плавающая форма "на данном этапе могут возникнуть вопросы"
	[...qsa('#aside_questions a.wa'), ...qsa('#aside_questions a.tg')].forEach(el => {
		el.listen("click", e => {
			e.target.classList.value == 'tg'
			? reach('telegram')
			: reach('whatsapp')
		})
	})

	// страница тура. aside. кнопка "Забронировать"
	qs('#aside_order button[type="submit"]')?.listen("click", e => reach('knopka_zabronirovat'))

	// страница тура. попап tourOrderPopup
	qs('#tourOrderPopup button')?.listen("click", e => reach('knopka_otpavit'))

	// страница тура. попап tourOrderPopup. успешно отправленная заявка
	document.listen("tourOrderPopup_send", e => reach('zayavka'))


	// страница тура. программа. ссылка "получить на email"
	qs('#program .row .email span')?.listen("click", e => reach('knopka_pochta'))

	// страница тура. программа. отправка формы на почту
	document.listen("email_send", e => reach('otpravil_pochtu'))


}

export function reach(target_name){

	try {
		ym(28209561, 'reachGoal', target_name)
	} catch(e){
		console.log(e)
	}
	
}

export const fancy = {
	async load(){
		return new Promise((resolve) => {

			if(!qs('.reviews-list li')) resolve(false)

			if(qs('[fancy]')) resolve(true)

			let script = document.createElement("script")
			script.src = "/vendors/fancy/fancybox.umd.js"
			script.setAttribute('fancy', '')
			qs(".scripts-area").appendChild(script)


			script.onload = () => {
				let style = loadCSS("/vendors/fancy/fancybox.css")
				onloadCSS(style, _ => resolve(true))
			}

		})
	},
	init(){
		Fancybox.bind("[data-fancybox]", {
			// Your custom options
			hideScrollbar: false
		});
	}
}



export async function Fetch(action, data, path){

	data = JSON.stringify(data)

	let host = process.env.NODE_ENV == 'development' ? 'https://adventuretime.pro':''
	let body = `action=${action}&data=${data}`
	process.env.NODE_ENV == 'development' ? body += `&mode=dev` : ''

	
	
	let response = await fetch(host+path, {
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		body: body
	});
	
	if(!response.ok){
		throw new Error('Ошибка сервера')
	}

	return await response.json();


}

/**
 * Склонение существительных
 * Правильная форма cуществительного рядом с числом (счетная форма).
 *
 * @example declension("файл", "файлов", "файла", 0);//returns "файлов"
 * @example declension("файл", "файлов", "файла", 1);//returns "файл"
 * @example declension("файл", "файлов", "файла", 2);//returns "файла"
 *
 * @param {string} oneNominative единственное число (именительный падеж)
 * @param {string} severalGenitive множественное число (родительный падеж)
 * @param {string} severalNominative множественное число (именительный падеж)
 * @param {(string|number)} number количество
 * @returns {string}
 */
export function declension(oneNominative, severalGenitive, severalNominative, number) {
	number = number % 100;

	return (number <= 14 && number >= 11)
		? severalGenitive
		: (number %= 10) < 5
			? number > 2
				? severalNominative
				: number === 1
					? oneNominative
					: number === 0
						? severalGenitive
						: severalNominative//number === 2
			: severalGenitive
	;
};
