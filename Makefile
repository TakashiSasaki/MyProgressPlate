.PHONY: pull-gas pull-jsdoit

pull-gas:
	clasp pull

pull-jsdoit:
	curl -o jsdoit.html http://jsrun.it/TakashiSasaki/SOuH/html ;\
	curl -o jsdoit.css http://jsrun.it/TakashiSasaki/SOuH/css ;\
	curl -o jsdoit.js http://jsrun.it/TakashiSasaki/SOuH/js ;\
	curl -o domUtils.html http://jsrun.it/TakashiSasaki/domUtils/html ;\
	curl -o domUtils.css http://jsrun.it/TakashiSasaki/domUtils/css ;\
	curl -o domUtils.js http://jsrun.it/TakashiSasaki/domUtils/js 
