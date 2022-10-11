FROM hadmarine/docker-environments:ubuntu20-node_latest


RUN git config --global core.autocrlf input

CMD zsh