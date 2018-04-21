FROM node:9 as builder
ENV NODE_ENV=production
ARG REACT_APP_DATASERVICE_API=http://localhost:5000
ARG REACT_APP_COORDINATOR_API=http://localhost:5001
RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install --quiet
RUN npm run build

# Copy built app into nginx container
FROM nginx:1.13.5
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
