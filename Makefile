
SRC = $(wildcard lib/*.js)

build: components $(SRC)
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

node_modules: package.json
	@npm install

server: node_modules
	@node test/server

test: build
	@open http://localhost:4000

.PHONY: clean test