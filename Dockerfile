FROM debian:9.5-slim

LABEL "com.github.actions.name"="Indexer"
LABEL "com.github.actions.description"="Github action to automatically dump an index.json in every folder of a repository that lists all files inside it"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="https://github.com/rune/indexer-github-action"
LABEL "homepage"="rune.github.com/indexer-github-action"
LABEL "maintainer"="Rune"

ADD generate_indices.sh /generate_indices.sh
ENTRYPOINT ["/generate_indices.sh"]
