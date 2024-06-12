import { qs, qsa, sw } from "../libs"

export function swipers(){

	// страница article (запись в блоге)
	article_swiper()
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