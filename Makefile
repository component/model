
build: components lib/*
	@component build --dev

clean:
	@rm -rf build components node_modules

components: component.json
	@component install --dev

node_modules: package.json
	@npm install

test: build
	@component test phantom

.PHONY: clean test