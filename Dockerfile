FROM rust:1.67 as builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo install --path .
RUN sed -r "s/[12][0-9]{3}[01][0-9][0-3][0-9]/$(date '+%Y%m%d')/g" ./html/static/serviceworker.js

FROM debian:bullseye-slim
#RUN apt-get update && apt-get install -y && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/myapp /usr/local/bin/myapp
CMD ["myapp"]