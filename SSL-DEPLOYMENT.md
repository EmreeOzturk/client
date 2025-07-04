# 🔒 SSL Deployment Rehberi

## 🚨 Sorun: Let's Encrypt Connection Refused

Let's Encrypt, SSL sertifikası vermeden önce domain'inizin HTTP üzerinden erişilebilir olduğunu kontrol eder. 
Bu nedenle SSL sertifikası almak için **iki aşamalı** deployment gerekiyor.

## 📋 İki Aşamalı Deployment

### 🔄 Aşama 1: HTTP Servisi Başlatma

```bash
# 1. Mevcut container'ları durdur
docker compose down

# 2. HTTP-only servisi başlat
docker compose -f docker-compose.http.yml up -d

# 3. Servisin çalıştığını kontrol et
docker compose -f docker-compose.http.yml ps
curl -I http://checkout.dltpaymentssystems.com/.well-known/acme-challenge/test
```

### 🔒 Aşama 2: SSL Sertifikası Alma

```bash
# 4. SSL sertifikasını al
docker compose -f docker-compose.ssl.yml run --rm certbot

# 5. HTTP servisini durdur
docker compose -f docker-compose.http.yml down

# 6. HTTPS servisini başlat
docker compose -f docker-compose.ssl.yml up -d
```

## 🛠️ Detaylı Adımlar

### 1. Klasör Yapısını Kontrol Et
```bash
# Checkout klasörüne git
cd /path/to/checkout

# Gerekli dosyaların varlığını kontrol et
ls -la
# Görmeli: docker-compose.http.yml, docker-compose.ssl.yml, nginx-http.conf, nginx-ssl.conf, .env
```

### 2. Certbot Klasörlerini Hazırla
```bash
# Certbot klasörlerini oluştur
mkdir -p certbot/conf certbot/www

# İzinleri ayarla
chmod 755 certbot/conf certbot/www
```

### 3. HTTP Servisi Başlat
```bash
# HTTP servisi başlat
docker compose -f docker-compose.http.yml up -d

# Logları kontrol et
docker compose -f docker-compose.http.yml logs nginx

# Nginx konfigürasyonunu test et
docker compose -f docker-compose.http.yml exec nginx nginx -t
```

### 4. Domain Erişimini Test Et
```bash
# HTTP erişimini test et
curl -I http://checkout.dltpaymentssystems.com/health
curl -I http://checkout.dltpaymentssystems.com/.well-known/acme-challenge/test

# Port 80'in açık olduğunu kontrol et
sudo netstat -tulpn | grep :80
```

### 5. SSL Sertifikası Al
```bash
# SSL sertifikasını al
docker compose -f docker-compose.ssl.yml run --rm certbot

# Sertifika başarılı alındıysa
ls -la certbot/conf/live/checkout.dltpaymentssystems.com/
```

### 6. HTTPS Servisine Geç
```bash
# HTTP servisini durdur
docker compose -f docker-compose.http.yml down

# HTTPS servisini başlat
docker compose -f docker-compose.ssl.yml up -d

# Durumu kontrol et
docker compose -f docker-compose.ssl.yml ps
```

## 🔧 Sorun Giderme

### 1. Connection Refused Hatası
```bash
# Port 80'in açık olduğunu kontrol et
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443

# Firewall kurallarını kontrol et
sudo iptables -L -n | grep :80
```

### 2. Nginx Konfigürasyon Hatası
```bash
# Nginx konfigürasyonunu test et
docker compose -f docker-compose.http.yml exec nginx nginx -t

# Nginx loglarını kontrol et
docker compose -f docker-compose.http.yml logs nginx
```

### 3. Domain DNS Sorunu
```bash
# DNS çözümlemesini test et
nslookup checkout.dltpaymentssystems.com
dig checkout.dltpaymentssystems.com

# IP adresinin doğru olduğunu kontrol et
curl -I http://144.91.97.235/.well-known/acme-challenge/test
```

### 4. Certbot Debug
```bash
# Certbot'u debug modunda çalıştır
docker compose -f docker-compose.ssl.yml run --rm certbot \
  certonly --webroot --webroot-path=/var/www/certbot \
  --email checkout@dltpaymentssystems.com --agree-tos --no-eff-email \
  -d checkout.dltpaymentssystems.com \
  --dry-run --verbose
```

## 📝 Komutlar Özeti

### Tam Deployment Süreci
```bash
# 1. HTTP servisini başlat
docker compose -f docker-compose.http.yml up -d

# 2. Domain erişimini test et
curl -I http://checkout.dltpaymentssystems.com/health

# 3. SSL sertifikasını al
docker compose -f docker-compose.ssl.yml run --rm certbot

# 4. HTTPS servisine geç
docker compose -f docker-compose.http.yml down
docker compose -f docker-compose.ssl.yml up -d

# 5. HTTPS erişimini test et
curl -I https://checkout.dltpaymentssystems.com/health
```

### Sertifika Yenileme
```bash
# Sertifikayı yenile
docker compose -f docker-compose.ssl.yml run --rm certbot renew

# Nginx'i yeniden başlat
docker compose -f docker-compose.ssl.yml restart nginx
```

## 🚨 Önemli Notlar

1. **Port 80 ve 443** açık olmalı
2. **DNS A record** doğru IP'yi göstermeli
3. **Firewall** HTTP/HTTPS trafiğine izin vermeli
4. **Domain** Let's Encrypt'in erişebileceği durumda olmalı

## ✅ Başarı Kontrol Listesi

- [ ] HTTP servisi çalışıyor
- [ ] Port 80 açık
- [ ] Domain HTTP üzerinden erişilebilir
- [ ] `.well-known/acme-challenge/` path'i çalışıyor
- [ ] SSL sertifikası alındı
- [ ] HTTPS servisi çalışıyor
- [ ] Domain HTTPS üzerinden erişilebilir

Bu adımları takip ederek SSL sertifikasını başarıyla alabilirsin! 