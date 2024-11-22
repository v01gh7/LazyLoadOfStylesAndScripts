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
		jsCallbackChain: 'initSlides'

	},
	{
		triggerElementSelector: '[name="phone__number"]',
		styles: [],
		js: [
			'https://cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js'
		],
		jsCallbackChain: 'initPhoneNumbers'
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


function updateLazyLoadState(src) {
	return window.rapidLazyLoadState.push(src);
}

function getElement(target, targetFrom=false){

	return targetFrom ? targetFrom.querySelector(target) : document.querySelector(target);

}



const getAttribute = (element, attr, isReturnValue) => {
	if(element && element.attributes && element.attributes[attr]){
		return isReturnValue ? element.attributes[attr].value : element.attributes[attr];
	}
	return false;

}

function canILoadIt(elToLoad, selectorToLoad) {
	return !window.rapidLazyLoadState.includes(elToLoad) && !getElement(selectorToLoad)
}


function loadStyles(styles){
	for(const style of styles){
		if(canILoadIt(style, `link[href="${ style }"]`)){
			updateLazyLoadState(style);
			const styleLink = document.createElement('link');
			styleLink.rel = 'stylesheet';
			styleLink.href = style;
			document.head.appendChild(styleLink);
		}
	}	
}

// Function to load styles and scripts
function loadScripts(scripts, jsCallbackChain) {

	for(const scriptSrc of scripts){
		if(canILoadIt(scriptSrc, `script[src="${ scriptSrc }"]`)){
			updateLazyLoadState(scriptSrc);

			const script = document.createElement('script');
			script.src = scriptSrc;
			script.defer = true;
			if(jsCallbackChain && window[jsCallbackChain]){
				// in some point it triggers "window[jsCallbackChain]" as not iterable, but it's a list of functions,
				// that's why repush into another list as simple fast bypass error
				window.triggersChains.push(...window[jsCallbackChain]);
				script.addEventListener('load', _ => {
					for(let triggerChain of window.triggersChains){
						triggerChain();
					}
				});
			}				
			document.body.appendChild(script);
		}
	}
}

function updateLazyLoadStack(searchTriggerElementSelector){
	for (let i = 0; i < window.rapidLazyLoads.length; i++) {
		if (window.rapidLazyLoads[i].triggerElementSelector === searchTriggerElementSelector) {
			window.rapidLazyLoads.splice(i, 1); // Remove the dictionary at index i
			break; // Stop the loop after removing the dictionary
		}
	}	
}

function getFromLazyLoadStack(searchTriggerElementSelector){
	for (let i = 0; i < window.rapidLazyLoads.length; i++) {
		if (window.rapidLazyLoads[i].triggerElementSelector === searchTriggerElementSelector) {
			return window.rapidLazyLoads[i]; // Remove the dictionary at index i
		}
	}	
}

for(let rapidLazyload of window.rapidLazyLoads){
	if(!document.querySelector(rapidLazyload.triggerElementSelector)){
		updateLazyLoadStack(rapidLazyload);
	}
}



window.triggersChains = [];
window.currentProcessingTarget = null;

const rapidLazyLoadObserer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && window.currentProcessingTarget != entry.target) {
    	window.currentProcessingTarget = entry.target;
    	currentTargetLazyLoadBlock = getFromLazyLoadStack(getAttribute(entry.target, 'data-observe_selector', true));
    	if(currentTargetLazyLoadBlock){
			if(currentTargetLazyLoadBlock.styles){
				loadStyles(currentTargetLazyLoadBlock.styles);
			}
			if(currentTargetLazyLoadBlock.js){
				loadScripts(currentTargetLazyLoadBlock.js, currentTargetLazyLoadBlock.jsCallbackChain);
			}

			updateLazyLoadStack(currentTargetLazyLoadBlock.triggerElementSelector);
			rapidLazyLoadObserer.unobserve(entry.target);	    		
    	}
    }
  });
}, { });

for(let rapidLazyload of window.rapidLazyLoads){
	const observeTarget = document.querySelector(rapidLazyload.triggerElementSelector);
	if(observeTarget){
		observeTarget.setAttribute('data-observe_selector', rapidLazyload.triggerElementSelector);
		rapidLazyLoadObserer.observe(observeTarget);
	}
}
