---
layout: post
date: '2008-04-21 12:27:41'
slug: prototype-jquery-and
title: Prototype, jQuery and the toggling of hidden elements
---

Just wanted to share a couple of little Prototype niggles. In general I'm pro-\[Prototype\]\[pro\] because it feels like it's a closer fit to the typical ways of working that you see in non-library-using Javascript. \[JQuery\]\[jq\], on the other hand, has chaining and acts on elements using the same interfaces regardless of whether there are one or many. From the dabbling I've done, it seems like that gets you into the odd head-twisting situation, but I've yet to embark on a big project with jQuery, so judgement is reserved for now.

Having said that, here's one instance where jQuery comes out on top. Showing & hiding of elements is a pretty common JS/DOM task and you're probably familiar with an issue where hidden elements need an inline style of `style="display:none;"` to allow them to be shown again.  This is because the un-hiding is done by setting the display property of the element to an empty string, thereby allowing the element to re-inherit it's default style. If the styling is done via CSS instead (`.hide { display:none; }`) then the styling is further up the inheritance chain so the element always inherits from here instead and can't be unhidden.

Prototype has the most basic show/hide implementation and makes no attempt at a work around. Its documentation even makes \[specific reference to the issue\]\[pro2\]: "Element.show cannot display elements hidden via CSS stylesheets. Note that this is not a Prototype limitation but a consequence of how the CSS display property works".

Here's the implementation (from version 1.6; current at time of writing):

	@@javascript

	Element.Methods = {
		hide: function(element) {
			$(element).style.display = 'none';
			return element;
		},
		show: function(element) {
			$(element).style.display = '';
			return element;
		}
	}

But that's not the end of the story. JQuery does manage a workaround, and an effective one at that. When failing to show a hidden element it adds a temporary, unadorned element of the appropriate type to the document and checks what its display property is set to by default. Finally, if all else fails it resorts to "block".

Here's a version of the jQuery methods, ported for use with Prototype (the originals begin at line 2890 in \[jquery-1.2.3.js\]\[jq2\]):

	@@javascript

	Element.addMethods({
		show: function(elem){
			elem.style.display = elem.oldDisplay || '';
			if (elem.getStyle('display') == 'none') {
				var test = document.createElement(elem.tagName);
				$(document.body).insert({bottom: test});
				elem.style.display = test.getStyle('display');
				if (elem.style.display == 'none')
					elem.style.display = 'block';
				test.remove();
			}
			return elem;
		},
		hide: function(elem){
			elem.oldDisplay = elem.oldDisplay || elem.getStyle('display');
			elem.setStyle({display: 'none'});
			return elem;
		}
	});

Much nicer. I'm not sure what the guiding philosophy is for what gets included and what's left out of the big JS libraries. It seems like something like this should be in there as an easy fix to a common problem. I would think that the identity of the libraries lies more in their syntax and aesthetics than their capabilities, so there's little to lose from liberal cross-pollenation.

\[jq\]: http://jquery.com/
\[pro\]: http://www.prototypejs.org/
\[pro2\]: http://www.prototypejs.org/api/element/show
\[jq2\]: http://jqueryjs.googlecode.com/files/jquery-1.2.3.js