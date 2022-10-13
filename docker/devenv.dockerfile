FROM hadmarine/docker-environments:ubuntu20-node_latest


RUN git config --global core.autocrlf input

RUN nvm install node
RUN npm i -g yarn
RUN npm i -g @nestjs/cli

CMD zsh