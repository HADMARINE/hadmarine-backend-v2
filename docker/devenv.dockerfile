FROM hadmarine/docker-environments:ubuntu20-node16-1.0.2

RUN git config --global core.autocrlf input


RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# ENV NVM_DIR /usr/local/nvm

# RUN source $NVM_DIR/nvm.sh \
#     && nvm install node 


CMD zsh