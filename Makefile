.PHONY: pull-gas pull-jsdoit clean-jsdoit
.SUFFIXES: js html css

pull-gas:
	clasp pull

JSDOITFILES=SOuH.js SOuH.css SOuH.html domUtils.js domUtils.css domUtils.html DateUtility.js DateUtility.css DateUtility.html

clean-jsdoit:
	rm -rf $(JSDOITFILES)

pull-jsdoit: clean-jsdoit $(JSDOITFILES)

%.js: 
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/js

%.html:
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/html

%.css:
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/css


