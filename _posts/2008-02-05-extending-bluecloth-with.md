---
layout: post
date: '2008-02-05 11:36:43'
slug: extending-bluecloth-with
title: Extending BlueCloth with Pygments
link: 
extra: 
---

I just spent a fun couple of days tinkering with the engine of this site and have finally emerged bruised, tired and slathered in axle grease.

I started out just adding syntax highlighting but ended up adding page caching (to offset the performance hit of parsing code), and upgrading to Rails 2 (to get at a couple of caching related niceties). So due to all the change there may be the odd unresolved issue here or there that I've missed. Just drop me a comment if you spot anything poking out at an awkward angle.

I figured I'd inaugurate my code highlighting with a little write-up of how I ended up doing it. I originally planned to use \[Ultraviolet\]\[uv\], but found it way too slow and a bit verbose in the CSS-naming department among other things. I also looked at various JS highlighters, but couldn't find one to suit, and decided it's a fairly resource intensive task to be off-loading onto the client anyway. Then I finally came back around to what I'd been looking at originally, which was the excellent Python library, \[Pygments\]\[pyg\]. I was put off at first by it not being ruby-native, and wondered if I'd need something like \[RuPy\]\[rp\] to bridge the gap. In the end I decided it'd be acceptable to do a system call out to the `pygmentize` command line interface:

	@@ruby

	class BlueCloth

	  def escape_shell_arg(str)
	    "'%s'" % str.gsub("'","'\\\\\\\\''")
	  end

	  def transform_code_blocks(str, rs)
	    @log.debug " Transforming code blocks"

	    str.gsub(CodeBlockRegexp) {|block|
	      code,rest = $1,$2

	      # Remove the syntax line and extract the language from it
	      regx = /(?:\[ \]{4}|\t)+@@(.*)\n+/
	      lang = code.slice!(regx).slice(regx,1)
	      # Call out to pygmentize to markup the code for highlighting
	      code = `echo #{escape_shell_arg(code)} | pygmentize -f html -l #{escape_shell_arg(lang)}`
	      # Remove the extraneous wrapper markup that we don't need
	      code.sub!(/<div><pre>(.*)<\/pre><\/div>/m, '\1')

	      # Generate the codeblock
	      %{\n\n<pre><code>%s\n</code></pre>\n\n%s} % \[ outdent(code).rstrip, rest \]
	    }
	  end

	end

As you can probably see, I'm using \[BlueCloth\]\[bc\] to format my posts, so I'm over-riding the method it calls to deal with indented code blocks. Doesn't provide any more graceful hooks unfortunately. I've also added an `@@language` line inspired by an article at \[Warpspire\]\[ws\] so that Pygments doesn't have to play the language guessing game. In fact, if you're using a JS highlighter and that's all you need, you can get away with something like this:

	@@ruby

	class BlueCloth

	  alias old_transform_code_blocks transform_code_blocks

	  def transform_code_blocks(str, rs)
	    str = old_transform_code_blocks(str, rs)
	    str.gsub!(/<code>@@(.*)\n+/, '<code>')
	    return str
	  end

	end

Aliasing the existing handler method to another name so that we can write a wrapper for it rather than over-writing it completely.

Probably bears repeating that the first option isn't the speediest thing in the world, and might be best avoided unless you're prepared to implement some sort of caching. I should also mention that I finished putting this in place and then immediately found mention elsewhere of \[CodeRay\]\[cr\], which is a self-professed "fast" Ruby-native highlighter. I haven't tried it out yet but it looks fairly young and recommends Pygments itself right there on the front page anyway. Worth a look though.

Oh, one last thing. I've used javascript (and \[Prototype\]\[pt\]) for my line-numbering so it doesn't get in the way in the source and stays out of CSS-unfriendly formats like RSS:

	@@javascript

	function codeLineNumbering() {
		$$('pre.code code').each(function(code){
			var count = code.innerHTML.split("\n").length - 1;
			var lines = $A($R(1,count)).join("\n");
			code.insert({before:'<pre><code>'+lines+'</code></pre>'});
		});
	}

Short and sweet!

**Update:** Seems I was a little hasty with that line numbering function, \[here's a version\]\[ln\] that should also work in IE.

\[uv\]: http://ultraviolet.rubyforge.org/
\[pyg\]: http://pygments.org/
\[rp\]: https://rubyforge.org/projects/rupy/
\[bc\]: http://www.deveiate.org/projects/BlueCloth
\[ws\]: http://warpspire.com/tipsresources/programming/hacking-markdown-classes-on-the-element/
\[cr\]: http://coderay.rubychan.de/
\[pt\]: http://www.prototypejs.org/
\[ln\]: http://matt.tarbit.org/2008/07/23/javascript-line-numbering