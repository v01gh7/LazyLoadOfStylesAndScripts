window.rapidLazyLoads = [
	{
		triggerElementSelector: '[data-fancybox]',
		styles: [
			'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css'
		],
		js: [
			'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js'
		]
	},
	{
		triggerElementSelector: '.ajax_form',
		styles: [],
		js: [
			`https://www.google.com/recaptcha/api.js?hl=ru&onload=ReCaptchaCallbackV3&render=${ window.recaptchaPublickKey }`
		]
	},
	{
		triggerElementSelector: '.swiper-container',
		styles: [
			'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css'
		],
		js: [
			'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
		],
		jsTriggerChain: 'initSlides'

	},
	{
		triggerElementSelector: '[name="phone__number"]',
		styles: [],
		js: [
			'https://cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js'
		],
		jsTriggerChain: 'initPhoneNumbers'
	},
];

window.rapidLazyLoadState = [];

// Function to check if an element is in the viewport
function isElementInViewport(el) {
	const rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 && (rect.top <= window.innerHeight || rect.top <= document.documentElement.clientHeight) || rect.left >= 0 && (rect.left <= window.innerWidth || rect.left <= document.documentElement.clientWidth)
	);
}


function getElement(target, targetFrom=false){

	return targetFrom ? targetFrom.querySelector(target) : document.querySelector(target);

}

// Function to load styles and scripts
function loadStylesAndScripts(el, obj, styles, js) {
	// Load styles
	for(const style of styles){
		if(!window.rapidLazyLoadState.includes(style) && !getElement(`link[href="${ style }"]`)){
			window.rapidLazyLoadState.push(style);
			const styleLink = document.createElement('link');
			styleLink.rel = 'stylesheet';
			styleLink.href = style;
			document.head.appendChild(styleLink);
		}
	}

	// Load scripts
	for(const jsScript of js){
		if(!window.rapidLazyLoadState.includes(jsScript) && !getElement(`script[src="${ jsScript }"]`)){
			window.rapidLazyLoadState.push(jsScript);
			const script = document.createElement('script');
			script.src = jsScript;
			script.async = true;
			if(window[obj.jsTriggerChain]){
				jsTriggerChains = window[obj.jsTriggerChain];
				window.triggersChains.push(...jsTriggerChains);
				script.addEventListener('load', _ => {
					for(let jsTriggerChain of window.jsTriggerChains){
						jsTriggerChain();
					}
				});
			}				
			document.body.appendChild(script);
		}
	}
}

function updateLazyLoadStack(el){
	for (let i = 0; i < window.rapidLazyLoads.length; i++) {
		if (window.rapidLazyLoads[i].triggerElementSelector === el.triggerElementSelector) {
			window.rapidLazyLoads.splice(i, 1); // Remove the dictionary at index i
			break; // Stop the loop after removing the dictionary
		}
	}	
}

for(let rapidLazyload of window.rapidLazyLoads){
	if(!document.querySelector(rapidLazyload.triggerElementSelector)){
		updateLazyLoadStack(rapidLazyload);
	}
}


window.triggersChains = [];
const rapidLazyLoadLoader = _ =>{
	for(let rapidLazyload of window.rapidLazyLoads){
		const lazyLoadBlock = document.querySelector(rapidLazyload.triggerElementSelector);
		if (lazyLoadBlock && isElementInViewport(lazyLoadBlock)) {
			loadStylesAndScripts(lazyLoadBlock, rapidLazyload, rapidLazyload.styles, rapidLazyload.js);
			updateLazyLoadStack(rapidLazyload);
			if(window.rapidLazyLoads.length <= 0){
				window.removeEventListener('scroll', rapidLazyLoadLoader);
			}
		}
	}			
};
window.addEventListener('scroll', rapidLazyLoadLoader);		