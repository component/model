
SRC = $(wildcard lib/*.js)

build: components $(SRC)
	@component build --dev

components:
	@component install --dev

clean:
	rm -fr build components template.js

test: build
	@node test/server

.PHONY: clean test
