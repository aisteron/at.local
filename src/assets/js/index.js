import { Pages } from "./pages";
import { Ui } from "./ui";
import { translate } from "./ui/translate";

document.readyState !== 'loading' ? init() : document.addEventListener('DOMContentLoaded', init);

function init(){
	Ui()
	Pages()

	translate()

}
