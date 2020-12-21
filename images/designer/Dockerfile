FROM ghcr.io/xgovformbuilder/digital-form-builder-designer:latest

WORKDIR /usr/src/app

COPY . .
USER root
RUN chown -R 1001 /usr/src/app && \
    chmod -R 777 /usr/src/app
USER appuser

EXPOSE 3000
USER 1001
RUN ls -lah /usr/src/app
RUN yarn
CMD [ "yarn", "designer", "start" ]