FROM ghcr.io/xgovformbuilder/digital-form-builder-runner:$

WORKDIR /usr/src/app

COPY . .
USER root
RUN chown -R 1001 /usr/src/app && \
    chmod -R 777 /usr/src/app
USER appuser

EXPOSE 3009
USER 1001
RUN ls -lah /usr/src/app
RUN yarn
CMD [ "yarn", "runner", "start" ]