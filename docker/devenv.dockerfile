FROM hadmarine/docker-environments:ubuntu20-node_latest

# SHELL ["/bin/zsh", "-c", "source ~/.profile && "]
SHELL [ "/bin/bash", "-c" ]

RUN git config --global core.autocrlf input
RUN source ~/.profile && npm i -g @nestjs/cli

CMD [ "zsh" ]