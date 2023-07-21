FROM node:16

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/vscode-test-web

RUN export NODE_ENV=development

EXPOSE 3000
EXPOSE 3001 
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004
EXPOSE 3005

WORKDIR /usr/src/app

CMD cd ./components/block-template;PORT=3001 npm run start & cd ../form-block;PORT=3002 npm run start & cd ../page-template;PORT=3003 npm run start & cd ../plot-block;PORT=3004 npm run start & cd ../table-block;PORT=3005 npm run start & wait
#CMD [ "node", ".", "--protocol=https", "--browser=none", "--host=0.0.0.0", "--quality=insiders", "--extensionDevelopmentPath=..", "--extensionId=vscode-icons-team.vscode-icons" ]
