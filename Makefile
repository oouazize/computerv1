NAME = computor
NPM = npm

all: $(NAME)

$(NAME): package.json
	$(NPM) install
	$(NPM) run build
	echo '#!/bin/bash\n\n# Run the TypeScript program\nnode dist/index.js "$$@"' > $(NAME)
	chmod +x $(NAME)

clean:
	rm -rf dist
	rm -rf node_modules
	rm -f $(NAME)

fclean: clean
	rm -f package-lock.json

re: fclean all

.PHONY: all clean fclean re