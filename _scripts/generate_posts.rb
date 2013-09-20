#!/usr/bin/env ruby

require 'optparse'
require 'rubygems'
require 'mysql'
require 'time'
require 'yaml'

def usage(message)
  program = File.basename(__FILE__)
  $stderr.puts("Error: #{message}")
  $stderr.puts("Usage: #{program} -u username -p password -d database")
  exit
end

puts ARGV.inspect

loop do
  case ARGV[0]
  when /^(-u|--username)$/ then ARGV.shift; $username = ARGV.shift
  when /^(-p|--password)$/ then ARGV.shift; $password = ARGV.shift
  when /^(-d|--database)$/ then ARGV.shift; $database = ARGV.shift
  when /^-/ then usage("invalid option: #{ARGV[0].inspect}")
  else break
  end
end

unless defined?($username) && defined?($password) && defined?($database)
  usage("database details must be provided")
end

SINGLE_LINE = '-' * 50
DOUBLE_LINE = '=' * 50

REL_PATH = '_posts'
ABS_PATH = File.realpath(File.join(File.dirname(__FILE__), '..', REL_PATH))

def remove_posts
  posts = Dir.glob(File.join(ABS_PATH, '*.md'))
  posts_removed = posts.count
  posts.each {|path| File.unlink(path) }
  posts_removed
end

def create_posts
  posts_created = 0

  db = Mysql.new('localhost', $username, $password, $database)
  db.query('SET NAMES utf8')

  begin
    results = db.query('SELECT * FROM entries ORDER BY created_at DESC')
    results.each_hash do |row|

      next if row['slug'] == 'finepix-f601z-gadget-porn'
      next if row['slug'] == 'sample-article'
      next if row['variant'] == 'status'

      name = create_post_for_row(row)
      puts File.join(REL_PATH, name)
      posts_created += 1

    end
    results.free
  ensure
    db.close
  end

  posts_created
end

def create_post_for_row(row)
  row.each {|k,v| row[k] = v.force_encoding('UTF-8') if v.is_a?(String) }

  time = Time.parse(row['created_at']).strftime('%Y-%m-%d')
  slug = row['slug']
  body = row['content']

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

  file = File.open(File.join(ABS_PATH, name), 'w')
  file.write(meta)
  file.write(body)

  name
end

puts DOUBLE_LINE

puts "Removing old posts..."
posts_removed = remove_posts
puts "Finished removing #{posts_removed} old posts"

puts DOUBLE_LINE

puts "Creating new posts..."
puts SINGLE_LINE
posts_created = create_posts
puts SINGLE_LINE
puts "Finished creating #{posts_created} new posts"

puts DOUBLE_LINE

