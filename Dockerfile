FROM node:16

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/vscode-test-web

RUN export NODE_ENV=development

RUN npm ci
RUN npm run compile

EXPOSE 3000

CMD [ "node", ".", "--protocol=https", "--browser=none", "--host=0.0.0.0", "--quality=insiders", "--extensionDevelopmentPath=..", "--extensionId=vscode-icons-team.vscode-icons" ]
