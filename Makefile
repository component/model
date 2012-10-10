
build: components index.js proto.js static.js
	@component build --dev

components:
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@node test/server

.PHONY: clean test
