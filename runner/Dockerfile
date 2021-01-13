FROM node:12-alpine3.12 AS build
WORKDIR /usr/src/app
COPY . .
RUN apk add --no-cache bash && \
    npm install -g typescript  && \
    npm install -g @babel/core @babel/cli  && \
    yarn workspaces focus @xgovformbuilder/model  && \
    yarn workspaces focus @xgovformbuilder/runner  && \
    yarn model build && \
    yarn runner build

FROM node:12-alpine3.12 AS run
# working directory
WORKDIR /usr/src/app
# create and set non-root USER
RUN addgroup -g 1001 appuser && \
    adduser -S -u 1001 -G appuser appuser && \
    chown -R appuser:appuser /usr/src/app && \
    chmod -R +x  /usr/src/app
# copy build from previous stage
COPY --from=build --chown=appuser:appuser /usr/src/app/package.json /usr/src/app/.yarn /usr/src/app/node_modules /usr/src/app/runner /usr/src/app/model ./

USER 1001

EXPOSE 3009
CMD [ "yarn", "runner", "start" ]
