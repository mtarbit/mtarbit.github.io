#!/usr/bin/env bash

# Run expanded & compressed Sass watch processes side-by-side,
# intermingling their output. Ctrl-C twice to quit both Sasses.

# Enable job control so we can foreground the backgrounded
# 'expanded' sass process and send it a Ctrl-C after we've
# interrupted the foregrounded 'compressed' sass process.

# I tried cleaning up with kill instead, sending various
# signals to the background process's PID, but to no avail.
# The background process quits, but it leaves an orphaned
# watch process behind:

set -m

src_dir="$(dirname "${BASH_SOURCE[0]}")/.."
css_dir="$src_dir/assets/stylesheets"

sass --style expanded --watch "$css_dir/_sass/main.scss":"$css_dir/main.css" &
sass --style compressed --watch "$css_dir/_sass/main.scss":"$css_dir/main.min.css"

fg 1

