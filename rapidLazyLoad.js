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



// Function to check if an element is in the viewport
function isElementInViewport(el) {
	const rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 && (rect.top <= window.innerHeight || rect.top <= document.documentElement.clientHeight) || rect.left >= 0 && (rect.left <= window.innerWidth || rect.left <= document.documentElement.clientWidth)
	);
}

// Function to load styles and scripts
function loadStylesAndScripts(el, obj, styles, js) {
	// Load styles
	for(const style of styles){
		const styleLink = document.createElement('link');
		styleLink.rel = 'stylesheet';
		styleLink.href = style;
		document.head.appendChild(styleLink);
	}

	// Load scripts
	for(const jsScript of js){
		const script = document.createElement('script');
		script.src = jsScript;
		script.async = true;
		if(obj.jsTriggerChain && window[obj.jsTriggerChain]){
			window.triggersChains.push(...window[obj.jsTriggerChain]);
			script.onload = event => {
				for(let jsTriggerChain of jsTriggerChains){
					jsTriggerChain();
				}
			};
		}				
		document.body.appendChild(script);
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