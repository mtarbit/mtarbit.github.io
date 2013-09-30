#!/usr/bin/env bash

src_dir="$(dirname "${BASH_SOURCE[0]}")/.."
css_dir="$src_dir/assets/stylesheets"

# sass --style expanded --watch "$css_dir/_sass/main.scss":"$css_dir/main.css"
sass --style compressed --watch "$css_dir/_sass/main.scss":"$css_dir/main.min.css"
