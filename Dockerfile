FROM httpd:2.4
COPY .htaccess /usr/local/apache2/htdocs/.htaccess
COPY build/. /usr/local/apache2/htdocs/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf