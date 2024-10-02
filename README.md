# Lazy loader of Js Scripts and CSS Styles. (LazyLoader)

LazyLoader is a JS VANILA plugin (maded for freelance job (P.S. needed fast MVP)), to uptimize "Google PageSpeed Insights", old non using any front-end stacks layouts, for example wordpress theme, plain html5 templates, to lazy load no need styles and scripts. It depend on clear plain html 5 template without bunch of crap from main (landing page, under CMS) from 40 up-to 90+ in "Google PageSpeed Insights".

It triggers when LazyLoad block occurs in view port.

## Installation

You can load as just js file, or include it in end of body tag.


## Usage
In a window scope have list of task to load "rapidLazyLoads", example is bellow, just follow along, and it will lazy load you stuff.

```JavaScript
window.rapidLazyLoads = [
	{
		triggerElementSelector: '.swiper-container',
		styles: [
			'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css'
		],
		js: [
			'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
		],
		jsTriggerChain: 'initSlides'
	}
];
```

jsTriggerChain ==> is just name of list in window scope, which contains functions to later call.

```JavaScript
window.initSlides = [];
```

Just in some point in your code push function into your trigger chain which you setuped previously.

```JavaScript
const initProductSlider = _ => {...};
window.initSlides.push(initProductSlider);
```




## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)