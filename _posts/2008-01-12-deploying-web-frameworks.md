---
layout: post
date: '2008-01-12 11:27:48'
slug: deploying-web-frameworks
title: Deploying Web Frameworks
link: 
extra: 
---

There was a lot of chitter-chatter this last week about the new web frameworks and the situation with regard to their performance and ease of deployment in shared hosting environments:

* \[A Dreamhost employee\]\[dh\] bemoans the lack of support for shared hosting in Rails.
* \[David Heinemeier Hansson\]\[dhh\] responds with his standard "scratch your own itch" riposte.
* \[Alex Payne\]\[ap\] chips in with the view that shared hosts are toy environments anyway.
* \[James Bennett\]\[jb\] points out that this is indicative of a broader issue which also affects Django and the like.
* \[GNU VInce\]\[gv\] adds some particulars about Django's deployment situation. He also hints at the problem of game-changing technologies making it difficult for n00bs to climb aboard.

I've been waiting for a while for the hype to die down so we could have a sensible conversation about all of this. It seems to me that the vast majority of the Rails naysaying has been hinged on a misguided comparison between it and PHP, and  complaints about it's performance. There's clearly an issue there, but the issue doesn't seem to me to be with Rails in particular. The "it's hard" and "it's slow" complaints both seem to be missing the fact that \[Rails\]\[ror\], \[Django\]\[dj\] et al are solving a much larger problem than \[PHP\]\[php\].

The new web-development technologies are insta-frameworks, they come with all your professionalism and all your infrastructure in place from the outset. And the necessary baggage of memory overhead and complexity come along for the ride. The old familiars that we've been used to; PHP, Perl and the like come from the direction of shell-scripting-land where the most common case is the most basic. There are 100 hello worlds for every 1 webapp with all mod-cons. In contrast, the new web frameworks have the giants of Java-land in their sights. They say: we expect you to use url-rewriting, ORM, granular caching, TDD, asset servers etc. They'll make it as easy as humanly possible to do so, but as part of the bargain they'll expect you to step up and fulfill your side of the contract as a modern web professional.

And therein lies the crux of the problem I think. The new web frameworks shine a harsh critical light on the yawning gap between how we all started out and where we all should be. It seems like the majority of "I tried it, I didn't like it" stories are from people who burnt their tongue on the first taste and realised their skills weren't up to it. And the cries of "deployment! performance!" are from those who are aghast that they should understand anything about the servers and environments their apps are running in. 

When a framework solves all the problems you were familiar with, it's humbling to find that the problems you're left with are those you know the least about.

Yes, there's more to it than that and there is the odd complaint that's valid and well considered. There's certainly room for improvement, but these technologies are very, very young. If we can just support new ideas, give them a little breathing room, help investigate the new bottlenecks and understand that \[no technology can be all things to all men\]\[nsb\], then we might just see some progress.

\[dh\]: http://blog.dreamhost.com/2008/01/07/how-ruby-on-rails-could-be-much-better/
\[dhh\]: http://loudthinking.com/posts/21-the-deal-with-shared-hosts
\[ap\]: http://www.al3x.net/2008/01/shared-hosting-is-ghetto.html
\[jb\]: http://www.b-list.org/weblog/2008/jan/10/hosts/
\[gv\]: http://gnuvince.wordpress.com/2008/01/10/deploying-django/

\[ror\]: http://www.rubyonrails.org/
\[dj\]: http://www.djangoproject.com/
\[php\]: http://www.php.net/

\[nsb\]: http://en.wikipedia.org/wiki/No_Silver_Bullet