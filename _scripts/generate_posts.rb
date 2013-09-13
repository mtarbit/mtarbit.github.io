#!/usr/bin/env ruby

require 'rubygems'
require 'mysql'
require 'time'
require 'yaml'

db = Mysql.new('localhost', 'root', 'mun1ch', 'matt_tarbit_org')
db.query('SET NAMES utf8')

begin

  results = db.query('SELECT * FROM entries ORDER BY created_at DESC')
  results.each_hash do |row|

    time = Time.parse(row['created_at']).strftime('%Y-%m-%d')
    slug = row['slug']
    body = row['content']

    next if slug == 'finepix-f601z-gadget-porn'

    if body
      body.gsub!(/\[([^\]]+)\](?!\()/, '\[\1\]')
      body.gsub!(/\s+tar[get]+=(['"]).*?\1\s*>/i, '>')
      body.gsub!(/\s+class=(['"]).*?\1\s*>/i, '>')
      body.gsub!(/<a href=(['"]).+?\1>/i) {|m| m.gsub(/&(?!amp;)/, '&amp;') }
      body.gsub!(/<a href=(['"])([^'"]*)\1>([^<]*)<\/a>/i, '[\3](\2)')
      body.gsub!(/<(.*?)>/) {|m| m.downcase }
      body.gsub!('Muppet*Vision', 'Muppet Vision')
      body.gsub!('This years entries are up') {|m| "\n\n" + m }
      body.gsub!('After the relatively disastrous') {|m| "\n\n" + m }
      body.gsub!(/\r/, '')
      body.gsub!(/^@/, '&zwnj;@') # See: https://github.com/bhollis/maruku/issues/70
      body.gsub!('_whytheluckystiff', '\_whytheluckystiff')
    end

    meta = {
      'layout' => row['variant'],
      'date'   => row['created_at'],
      'slug'   => row['slug'],
      'title'  => row['title'],
      'link'   => row['url'],
      'extra'  => row['extra']
    }.to_yaml + "---\n\n"

    name = "#{time}-#{slug}.md"
    path = File.join('../_posts', name)

    file = File.open(path, 'w')
    file.write(meta)
    file.write(body)

    puts path

  end
  results.free

ensure
  db.close
end


