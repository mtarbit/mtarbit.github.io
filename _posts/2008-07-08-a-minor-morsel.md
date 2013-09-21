---
layout: post
date: '2008-07-08 19:47:22'
slug: a-minor-morsel
title: A minor morsel
---

I haven't posted in ages, so I might as well use this to break radio silence. It's a solution to [this little programming brain teaser from Dustin Diaz][dd]. I don't think it's as much of a puzzle as he seemed think, given by the responses in the comments and how long it took me, but regardless:

	@@javascript

	var listA = \['a', 'b', 'c', 'c', 'd', 'e', 'e', 'e', 'e', 'e', 'f', 'e', 'f', 'e', 'f', 'a', 'a', 'a', 'f', 'f', 'f'\];
	var listB = [];

	var count = 0;

	listA.forEach(function(val,key,arr){
	    var matchPrev = (val == arr\[key - 1\]);
	    var matchNext = (val == arr\[key + 1\]);

	    count = matchPrev ? count+1 : 0;

	    if (count == 2) {
	        val = '<span>' + val;
	    }
	    if (count >= 2 && !matchNext) {
	        val += '</span>';
	    }
    
	    listB.push(val);
	});

	console.log(listB.join(' '));

As some of the commenters' solutions show, it can be done in a [one-line regular expression][db], but I was sticking to the "rules" implicit in the original post.

[dd]: http://www.dustindiaz.com/programming-brain-teaser/
[db]: http://dmitry.baranovskiy.com/post/41419429
