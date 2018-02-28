.PHONY: pull-gas pull-jsdoit

pull-gas:
	clasp pull

pull-jsdoit:
	curl -o jsdoit.html http://jsrun.it/TakashiSasaki/SOuH/html ;\
	curl -o jsdoit.css http://jsrun.it/TakashiSasaki/SOuH/css ;\
	curl -o jsdoit.ts http://jsrun.it/TakashiSasaki/SOuH/js 


