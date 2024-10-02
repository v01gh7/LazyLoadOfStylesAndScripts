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