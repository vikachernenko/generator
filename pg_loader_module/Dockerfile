FROM grafana/xk6 AS builder
# Нужно зайти в любую папку, где можно писать файлы (например, /tmp)
WORKDIR /tmp
RUN xk6 build --with github.com/grafana/xk6-sql@latest \
    --with github.com/grafana/xk6-sql-driver-postgres@latest \
    -o k6-with-sql

FROM python:3.14-slim

COPY --from=builder /tmp/k6-with-sql /usr/local/bin/k6-with-sql

WORKDIR /pg_loader_module/

COPY . .

ENTRYPOINT ["python", "cli.py"]