.PHONY: pull-gas pull-jsdoit
.SUFFIXES: js

pull-gas:
	clasp pull

pull-jsdoit: SOuH.js SOuH.css SOuH.html domUtils.js domUtils.css domUtils.html DateUtility.js DateUtility.css DateUtility.html

%.js: 
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/js

%.html:
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/html

%.css:
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/css


