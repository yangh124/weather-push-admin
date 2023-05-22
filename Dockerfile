FROM nginx
LABEL maintainer="yh.124@qq.com"
COPY dist/  /usr/share/nginx/html/
COPY WW_verify_hD4RaulvpPjDxCVP.txt /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 80
ENTRYPOINT nginx -g "daemon off;"
