# 🌐 Reverse Proxy Setup Rehberi

## 📋 Genel Bakış

Bu setup ile tek bir domain üzerinden hem frontend hem backend'e erişim sağlanır:

- **Frontend**: `https://yourdomain.com/` → React uygulaması
- **Backend API**: `https://yourdomain.com/api/` → Express API
- **MongoDB**: Sadece internal network'ten erişim

## 🏗️ Mimari

```
Internet → Nginx (Port 80/443) → {
    / → React Frontend (Port 80)
    /api → Express API (Port 3001)
}
```

## 🚀 Hızlı Başlangıç

### 1. Development (HTTP)
```bash
# Docker Compose ile başlat
docker-compose up -d

# Erişim:
# Frontend: http://localhost/
# API: http://localhost/api/
```

### 2. Production (HTTPS)
```bash
# Environment dosyasını kopyala
cp env.production .env

# Domain ve email bilgilerini güncelle
nano .env

# SSL sertifikası al
docker-compose -f docker-compose.ssl.yml run --rm certbot

# Uygulamayı başlat
docker-compose -f docker-compose.ssl.yml up -d
```

## 🔧 Konfigürasyon Dosyaları

### 1. `nginx.conf` (Development)
- HTTP üzerinden çalışır
- CORS ayarları dahil
- Static file caching

### 2. `nginx-ssl.conf` (Production)
- HTTPS zorunlu
- SSL sertifikaları
- Security headers
- Gzip compression

### 3. `docker-compose.yml` (Development)
- HTTP setup
- Port 80 expose
- Basic konfigürasyon

### 4. `docker-compose.ssl.yml` (Production)
- HTTPS setup
- Let's Encrypt entegrasyonu
- Environment variables

## 🛠️ Kurulum Adımları

### Development Setup

```bash
# 1. Projeyi hazırla
mkdir -p /home/user/wert-app
cd /home/user/wert-app

# 2. Repository'leri clone et
git clone https://github.com/username/client.git
git clone https://github.com/username/express-js-on-vercel.git

# 3. Konfigürasyon dosyalarını kopyala
cp client/docker-compose.yml .
cp client/nginx.conf .

# 4. MongoDB key oluştur
openssl rand -base64 756 > mongodb.key
chmod 400 mongodb.key

# 5. Environment dosyasını hazırla
cp express-js-on-vercel/env.example express-js-on-vercel/.env

# 6. Uygulamayı başlat
docker-compose up -d
```

### Production Setup

```bash
# 1. SSL konfigürasyonunu kopyala
cp client/docker-compose.ssl.yml .
cp client/nginx-ssl.conf .
cp client/env.production .env

# 2. Domain bilgilerini güncelle
nano .env
# DOMAIN_NAME=yourdomain.com
# EMAIL=your-email@example.com

# 3. Nginx konfigürasyonunu güncelle
sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' nginx-ssl.conf

# 4. Let's Encrypt klasörlerini oluştur
mkdir -p certbot/conf certbot/www

# 5. İlk SSL sertifikasını al
docker-compose -f docker-compose.ssl.yml run --rm certbot

# 6. Uygulamayı başlat
docker-compose -f docker-compose.ssl.yml up -d
```

## 🔒 SSL Sertifikası Yenileme

### Otomatik Yenileme (Crontab)
```bash
# Crontab'a ekle
crontab -e

# Her gün 02:00'da kontrol et
0 2 * * * cd /home/user/wert-app && docker-compose -f docker-compose.ssl.yml run --rm certbot renew --quiet && docker-compose -f docker-compose.ssl.yml restart nginx
```

### Manuel Yenileme
```bash
# Sertifikayı yenile
docker-compose -f docker-compose.ssl.yml run --rm certbot renew

# Nginx'i yeniden başlat
docker-compose -f docker-compose.ssl.yml restart nginx
```

## 🌐 Frontend API Konfigürasyonu

### React'ta API Çağrıları
```javascript
// Önceki yapı (yanlış)
const API_URL = 'http://localhost:3001/api';

// Yeni yapı (doğru)
const API_URL = '/api';

// Örnek kullanım
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data));

// Axios ile
axios.get('/api/users')
  .then(response => console.log(response.data));
```

### Environment Variables
```bash
# Development
REACT_APP_API_URL=/api
REACT_APP_BASE_URL=http://localhost

# Production
REACT_APP_API_URL=/api
REACT_APP_BASE_URL=https://yourdomain.com
```

## 🔧 Backend API Konfigürasyonu

### Express.js Route Prefix
```javascript
// Eğer API'niz /api prefix'i bekliyorsa
app.use('/api', routes);

// Veya nginx'de /api'yi strip edebilirsiniz
// location /api {
//     proxy_pass http://backend/;  # Sondaki / önemli
// }
```

### CORS Konfigürasyonu
```javascript
// Express.js'te
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost',
  credentials: true
}));
```

## 📊 Monitoring ve Logging

### Nginx Logları
```bash
# Access logs
docker-compose logs nginx

# Error logs
docker exec nginx-proxy tail -f /var/log/nginx/error.log
```

### Application Logları
```bash
# API logs
docker-compose logs api

# Frontend logs
docker-compose logs client

# MongoDB logs
docker-compose logs mongodb
```

## 🚨 Sorun Giderme

### 1. 502 Bad Gateway
```bash
# Backend'in çalışıp çalışmadığını kontrol et
docker-compose ps
curl http://localhost:3001/health  # Container içinden

# Nginx konfigürasyonunu test et
docker exec nginx-proxy nginx -t
```

### 2. CORS Hatası
```bash
# Backend CORS ayarlarını kontrol et
# Nginx CORS headers'ını kontrol et
# Browser developer tools'da network tab'ını incele
```

### 3. SSL Sertifikası Hatası
```bash
# Sertifika durumunu kontrol et
docker-compose -f docker-compose.ssl.yml run --rm certbot certificates

# Sertifikayı yenile
docker-compose -f docker-compose.ssl.yml run --rm certbot renew --dry-run
```

### 4. React Router 404 Hatası
```bash
# Nginx fallback konfigürasyonunu kontrol et
# try_files direktifinin doğru olduğunu kontrol et
```

## 📋 Checklist

### Development ✅
- [ ] docker-compose.yml konfigüre edildi
- [ ] nginx.conf konfigüre edildi
- [ ] Frontend API_URL güncellendi
- [ ] Backend CORS ayarları yapıldı
- [ ] Tüm servisler ayakta

### Production ✅
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası alındı
- [ ] nginx-ssl.conf domain ile güncellendi
- [ ] Environment variables set edildi
- [ ] Firewall ayarları yapıldı (80, 443 portları)
- [ ] SSL otomatik yenileme kuruldu

## 🎯 Sonuç

Bu setup ile:
- ✅ Tek domain üzerinden tüm uygulamaya erişim
- ✅ HTTPS güvenliği
- ✅ Automatic SSL renewal
- ✅ Production-ready konfigürasyon
- ✅ Monitoring ve logging
- ✅ CORS sorunları çözüldü

Artık uygulamanız `https://yourdomain.com` üzerinden erişilebilir! 