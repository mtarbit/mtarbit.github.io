---
layout: post
date: '2008-07-23 21:00:45'
slug: javascript-line-numbering
title: JavaScript line numbering for code samples
link: 
extra: 
---

Whoopsie! While poking around on this site the other night I was horrified to discover it was pretty badly b0rked in IE. Not quite sure how I managed to miss that, but hopefully I've put it right now.

As bad luck would have it, one of the things that was broken was a javascript line-numbering function that I'd \[posted here previously\]\[mt\]. Best make amends with a corrected version for any readers I've lead astray, eh?

So where previously we had:

	@@javascript

	function codeLineNumbering() {
	    $$('pre.code code').each(function(code){
	        var count = code.innerHTML.split("\n").length - 1;
	        var lines = $A($R(1,count)).join("\n");
	        code.insert({before:'<pre><code>'+lines+'</code></pre>'});
	    });
	}

We now have:


	@@javascript
	
	function codeLineNumbering() {
		$$('pre.code code').each(function(code){
			var nodes = code.childNodes;
			var count = 1;
			var lines = [];
			for (var i=0; i < nodes.length; i++) {
				if (nodes\[i\].nodeType != 3) continue;
				var matches = nodes\[i\].nodeValue.match(/\[\r\n\]/g);
				if (matches) count += matches.length;
			}
			for (var i=1; i < count; i++) { lines.push(i); }
			code.up().insert({before:'<pre><code>'+lines.join("\n")+'</code></pre>'});
		});
	}

The crux of the issue was that innerHTML seems to behave slightly differently in IE. Other browsers give you a faithful recreation of what's present in the document source, while IE gives you it's reconstituted whitespace-insensitive version. 

In the old version of the code I was simply splitting innerHTML on newlines and counting how many lines I had in the resultant array. But with IE's interpretation of innerHTML that doesn't work so well since the odd newline may have been ditched or smooshed into its neighbour.

As a workaround, the substitute function uses the child nodes of the syntax-highlighted section of the document instead, which seem to be more faithful to the original source. I iterate through these looking for plain text nodes, and counting up how many newlines or carriage returns are present in each.

As a caveat I should say that I believe some of this behaviour is dependent on what your doctype and `white-space` CSS property are set to. Also, the code above makes the assumption that newlines will only be present in root text nodes and not nested within child elements. That's a safe assumption given the method of syntax highlighting I'm using, but it may not be for you.

Tsk, the perils of coding in public.


\[mt\]: http://matt.tarbit.org/2008/02/05/extending-bluecloth-with
