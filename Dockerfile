FROM node:15 as back
WORKDIR srv
COPY back/package.json back/package-lock.json ./
RUN npm install
COPY back/ .
RUN npm run build
CMD ["node", "--enable-source-maps", "./build/index.js"]
EXPOSE 3000

FROM node:15 as front
WORKDIR front/
COPY front/package.json front/package-lock.json ./
RUN npm install
COPY front/ .
RUN npm run ng build --prod

FROM nginx:1.19 as nginx
COPY --from=front front/dist/front /usr/share/nginx/html
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY config/nginx/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80