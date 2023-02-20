FROM node:18-alpine

WORKDIR /usr/src/alt-app

COPY . /usr/src/alt-app

RUN npm install
RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY entrypoint.sh /

ENV PORT 3000

EXPOSE 3000

RUN ["chmod", "+x", "/entrypoint.sh"]

ENTRYPOINT [ "/entrypoint.sh" ]

CMD tail -f /dev/null
