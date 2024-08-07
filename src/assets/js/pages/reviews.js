import { Fetch, cfg, qs, qsa } from "../libs"

export const Reviews = {
	list: [],
	ava: '',
	gallery: new Set([]),

	init(){
		if(!qs('.reviews-page')) return

		this.dropdown_tour_select() // фильтрация отзывов по турам
		this.review_item_collapse() // сворачивание отзыва в мобильной версии
		this.get_reviews(),
		this.load_ava(),
		this.load_gallery() // загрузка / удаление изображений

		this.send_to_server()

	},

	dropdown_tour_select(){
		let select = qs('.select-tour')
		if(!select) return
		
		// open / close
		select.listen("click", () => select.classList.toggle('open'))

		// select tour
		qsa('li[data-resid]').forEach(el => {
			el.listen("click", e => {
				let resid = +e.target.dataset.resid
				let label = e.target.innerHTML

				qs('.head span', select).innerHTML = label

				if(!this.list.length) return new Snackbar('Нет отзывов для фильтрации')
				if(resid == 0) return this.draw_review(this.list)

				this.draw_review(this.list.filter(el => el.tourid == resid))
				

			})
		})

	},

	draw_review(arr){

		let str = ``

		if(!arr.length){
			str = `<h3>Отзывов для этого тура не найдено</h3>`
			return qs('ul.reviews-list').innerHTML = str
		}

		arr.forEach((e,i) => {

			let surname = e.surname.substring(0,1).length ? e.surname.substring(0,1)+".": ''

			str += `
							<li>

								<div class="ava">
									<img src="${cfg.host}/${e.ava}">
									<span class="name">${e.name} ${surname}</span>
									<span class="country">${e.country}</span>
									<button class="collapse mt1"><svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0.625391L12 6.62539L10.6 8.02539L6 3.42539L1.4 8.02539L0 6.62539L6 0.625391Z" fill="#898989"></path></svg></button>
								</div>

								<div class="body">
									<div class="head">
										<span class="name">${e.tourname}</span>
										<span class="date">${new Date(e.date).toLocaleDateString()}</span>
									</div>
									<div class="cnt">${e.txt}</div>
									<div class="gallery">
										${e.gal.map(el => `<a href="${cfg.host + el.origin}" data-fancybox="gallery-${i}"><img src="${cfg.host + el.thumb}" width="85" height="85"></a>`).join('')}
									</div>
								</div>
								
						</li>
			`
		})

		qs('ul.reviews-list').innerHTML = str
		
		

	},

	async get_reviews(){
		let res;

		try {
			res = await Fetch('get_reviews',{},'/api')
		} catch(e){
			new Snackbar(e)
			//console.log(e)
		}

		if(!res) return
		this.list = res

	},

	review_item_collapse(){
		const buttons = qsa('.reviews-list button.collapse')
		if(!buttons) return

		buttons.forEach(button => {
			button.listen("click", e => {
				e.target.closest('li').classList.toggle('closed')
			})
		})
	},
	load_ava(){
		let cradio = qs('.avlist .custom [name="ava"]')
		let label = cradio.closest('label')
		qs('.avlist .custom input[type="file"]')?.listen("change", e => {
			cradio.checked = true
			let file = e.target.files[0];
			
			let reader = new FileReader();
			reader.readAsDataURL(file)
			reader.onload = function() {
				Reviews.ava = file
				qs('svg', label)?.remove()
				qs('.custom_ava_blob', label)?.remove()
				
				label.insertAdjacentHTML('afterbegin',`<img src="${reader.result}" width="69" height="69" class="custom_ava_blob"/>`)
			};
		})
	},
	load_gallery(){

		const allowed_types = new Set(["image/jpeg","image/heif", "image/heic"])
		
		qs('form#review .files input[type="file"]').listen("change", e =>{
			let file = e.target.files[0]
			let size = (file.size / (1024*1024)).toFixed(2)
			if(size >= 15) return new Snackbar('❌ Размер больше 15 Мб')
			if(!allowed_types.has(file.type)) return new Snackbar('❌ Этот тип файла не поддерживается')
			if(this.gallery.size >= 5) return new Snackbar('❌ Больше 5 фото нельзя')
			
			
			this.gallery.add(file)


			let reader = new FileReader();
			reader.readAsDataURL(file)
			reader.onload = function() {

				let image = `<img src="${reader.result}" width="50" height="50" data-modified="${file.lastModified}"/>`
				qs('#review .files .gallery').insertAdjacentHTML('beforeend',image)

				qs(`[data-modified="${file.lastModified}"]`).listen("click", e => {
					
					let g = Array.from(Reviews.gallery)
					
					Reviews.gallery = new Set(g.filter(el => el.lastModified !== +e.target.dataset.modified))
					
					e.target.remove()
				})
			};

		})
	},
	send_to_server(){
		
		const f = qs('form#review')
		
		f.listen("submit", async e => {
			e.preventDefault();
			let formData = new FormData();
			qs('button[type=submit]').disabled = true
			qs('button[type=submit]').innerHTML = 'Загрузка...'

			formData.append('action', 'review_receive');

			formData.append('name', qs('[name="name"]',f).value);
			formData.append('surname', qs('[name="surname"]',f).value);
			formData.append('tourname', qs('[name="tourname"]',f).value);
			formData.append('emoji', qs('[name="emoji"]',f).value);
			formData.append('guide', qs('[name="guide"]',f).value);
			formData.append('future', qs('[name="future"]',f).value);
			
			let ava_cls = qs('.avlist input[name=ava]:checked').closest('li').classList.value
			formData.append('ava', Reviews.ava ? Reviews.ava : ava_cls)
			
			Reviews.gallery.size
				&& Array.from(Reviews.gallery).forEach((el, i) => formData.append(`gallery-${i}`, el))
			
			//for (var p of formData) { console.log(p);}
			

			let res = await fetch("http://at.ashaev.by/api",{
				method: 'POST',
				body: formData
			})

			res = await res.json()

			if(res.success){
				new Snackbar(res.message?res.message:'✅ Успешно отправлено ')
				f.reset()
				Reviews.gallery = new Set([])
				qs('#review .files .gallery').innerHTML = ''

			} else {
				new Snackbar(res.message?res.message:'❌ Что-то пошло не так(')
			}

			qs('button[type=submit]', f).disabled = false
			qs('button[type=submit]').innerHTML = 'Отправить'

		})

	}

}
