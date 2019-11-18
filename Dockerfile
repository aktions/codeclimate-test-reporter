FROM alpine:3.10

COPY LICENSE README.md /

COPY entrypoint.sh /entrypoint.sh

RUN apk add curl jq

ENTRYPOINT ["/entrypoint.sh"]
