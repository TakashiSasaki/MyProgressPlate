.PHONY: pull-gas pull-jsdoit clean-jsdoit
.SUFFIXES: js html css
.PRECIOUS: %.js %.html %.css

pull-gas:
	clasp pull

JSDOITFILES=SOuH.js domUtils.js DateUtility.js Strip.js

clean-jsdoit:
	rm -rf SOuH.* domUtils.* DateUtility.* Strip.*

pull-jsdoit: $(JSDOITFILES)

%.js: %.html %.css
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/js

%.html:
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/html

%.css:
	curl -o $@ http://jsrun.it/TakashiSasaki/$*/css


