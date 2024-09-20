import { qs, qsa, sw } from "../libs"

export function swipers(){

	// страница article (запись в блоге)
	article_swiper()

	// home page main swiper
	home_page_hero_swiper()
	home_page_tours_swiper()

	// страница тура. эксперт
	tour_page_expert()

	// страница тура. отели. мобильная версия
	tour_page_hotels()

	// страница тура. контентная галерея . мобильная версия
	tour_page_cnt_gallery()

	// страница о нас
	about_page_swiper()

}

async function article_swiper(){
	if(!qs('.article-swiper')) return
	await sw.load()

	qsa('.article-swiper').forEach(el => {
		
		let options_thumb = {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    }

		let swiper_thumb = new Swiper(qs('.swiper.thumbs', el), options_thumb)

		let options_main = {
      spaceBetween: 10,
      navigation: {
        nextEl: qs('svg.next', el),
        prevEl: qs('svg.prev', el),
      },
      thumbs: {
        swiper: swiper_thumb,
      },
		}
		
		new Swiper(qs('.swiper.main', el), options_main)


	})
}

async function home_page_hero_swiper(){
	const home_swiper = qs('.home.swiper')
	if(!home_swiper) return
	await sw.load()

	let options = {
		pagination: {
			el: qs(".swiper-pagination", home_swiper),
		},
	}
	new Swiper(home_swiper, options)	
}

async function home_page_tours_swiper() {
	const tours_swiper = qs('.swiper-tours .swiper')
	if(!tours_swiper) return

	await sw.load()

	let options = {
		
		navigation: {
			nextEl: qs(".swiper-tours .next"),
		},
		breakpoints:{

			0: {
				slidesPerView: 1,
				spaceBetween: 26,
			},
			480: {
				slidesPerView: 2,
				spaceBetween: 26,
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 26,
			}
		}
	}
	new Swiper(tours_swiper, options)
}

async function tour_page_expert(){
	const swiper = qs('.tour-page .swiper.expert')
	if(!swiper) return

	await sw.load()

	const options = {
		navigation: {
			nextEl: qs('.next', swiper.closest('.left')),
			prevEl: qs('.prev', swiper.closest('.left')),
		},
	}

	new Swiper(swiper,options)
}


async function tour_page_hotels(){
	if(!qs('.hotels-swiper')) return
	await sw.load()
	
	qsa('.hotels-swiper .swiper').forEach(el => {

		const opts = {
			spaceBetween: 16,
			pagination: {
				el: qs(".swiper-pagination", el.parentNode),
			},
			}

		new Swiper(el,opts)	

	})

}

async function tour_page_cnt_gallery(){
	const cnt_swiper = qs('.cnt-swiper')
	if(!cnt_swiper) return
	await sw.load()
	
	const opts = {
		spaceBetween: 16,
		pagination: {
			el: qs(".swiper-pagination", cnt_swiper),
		},
	}

new Swiper(qs('.swiper', cnt_swiper),opts)
}

async function about_page_swiper(){
	let swiper = qs('.about-page .hero.swiper')
	if(!swiper) return



	await sw.load()
	
	const opts = {
		spaceBetween: 16,
		pagination: {
			el: qs(".swiper-pagination", swiper),
		},
	}

	new Swiper(swiper,opts)

	// custom lazy
	qsa('.swiper-slide [data-srcset]').forEach(el => el.srcset = el.dataset.srcset)
	qsa('.swiper-slide [data-src]').forEach(el => el.src = el.dataset.src)

}