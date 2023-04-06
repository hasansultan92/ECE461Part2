
HOME = ./
CONTROLLERS = ./controllers/ ./routes/
FILESCOMPILE = $(CONTROLLERS)*
STARTINGPOINT = main
EXTS := js js.map
RM := /bin/rm -f

compile : clean
	npm run compile

install:
	 npm install
	 
clean2:
	find ./routes/ ./controllers/ -depth -type f \( -name '*.js' \) -exec $(RM) {} +

clean:
	find $(CONTROLLERS) -depth -type f \( -name '*.js' \) -exec $(RM) {} +
	find $(CONTROLLERS) -depth -type f \( -name '*.d.ts' \) -exec $(RM) {} +
	find $(CONTROLLERS) -depth -type f \( -name '*.map' \) -exec $(RM) {} +

