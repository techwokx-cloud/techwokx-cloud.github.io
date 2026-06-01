FROM php:8.2-apache

# Install SQLite extension
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    sqlite3 \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite for .htaccess
RUN a2enmod rewrite headers expires

# Set document root to /var/www/html
WORKDIR /var/www/html

# Copy all project files
COPY . .

# Create persistent data directory for SQLite
# In Railway: mount a Volume at /data
RUN mkdir -p /data && chown www-data:www-data /data

# Apache config — allow .htaccess overrides
RUN echo '<Directory /var/www/html>\n\
    Options -Indexes\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/techwokx.conf \
    && a2enconf techwokx

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type f -exec chmod 644 {} \; \
    && find /var/www/html -type d -exec chmod 755 {} \;

# Railway injects PORT env variable
ENV APACHE_RUN_USER=www-data
ENV APACHE_RUN_GROUP=www-data
ENV APACHE_LOG_DIR=/var/log/apache2

# Update Apache to listen on Railway's dynamic PORT
RUN sed -i 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf \
    && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' \
       /etc/apache2/sites-available/000-default.conf

EXPOSE ${PORT:-80}

CMD ["apache2-foreground"]
