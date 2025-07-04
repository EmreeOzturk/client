# 🚀 Sunucu Deployment Rehberi

## 📁 Klasör Yapısı

### Seçenek 1: Ayrı Repository'ler (Önerilen)
```bash
# Sunucuda klasör yapısı
/home/user/wert-app/
├── client/                 # Client repository
├── express-js-on-vercel/   # API repository  
├── docker-compose.yml      # Ana orchestration dosyası
├── mongodb.key            # MongoDB authentication key
└── .env                   # Global environment variables
```

### Seçenek 2: Monorepo
```bash
# Tek repository içinde
/home/user/wert-app/
├── client/
├── express-js-on-vercel/
├── docker-compose.yml
├── mongodb.key
└── README.md
```

## 🛠️ Deployment Adımları

### 1. Sunucuda Klasör Hazırlama
```bash
# Ana klasör oluştur
mkdir -p /home/user/wert-app
cd /home/user/wert-app

# Repository'leri clone et
git clone https://github.com/username/client.git
git clone https://github.com/username/express-js-on-vercel.git
```

### 2. MongoDB Key Oluşturma
```bash
# MongoDB authentication key oluştur
openssl rand -base64 756 > mongodb.key
chmod 400 mongodb.key
```

### 3. Docker Compose Dosyasını Kopyalama
```bash
# Client klasöründen ana klasöre kopyala
cp client/docker-compose.yml .

# Veya wget ile direkt indir
wget https://raw.githubusercontent.com/username/client/main/docker-compose.yml
```

### 4. Environment Dosyalarını Hazırlama
```bash
# Express API için .env dosyası oluştur
cp express-js-on-vercel/env.example express-js-on-vercel/.env

# .env dosyasını düzenle
nano express-js-on-vercel/.env
```

### 5. Uygulamayı Başlatma
```bash
# Docker Compose ile başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs -f
```

## 🔧 Alternatif Çözümler

### Çözüm A: Relative Path Kullanımı
```yaml
# docker-compose.yml içinde
api:
  build:
    context: ./express-js-on-vercel
  volumes:
    - ./express-js-on-vercel/.env:/app/.env:ro

client:
  build:
    context: ./client
```

### Çözüm B: Absolute Path Kullanımı
```yaml
# docker-compose.yml içinde
api:
  build:
    context: /home/user/wert-app/express-js-on-vercel
  volumes:
    - /home/user/wert-app/express-js-on-vercel/.env:/app/.env:ro
```

### Çözüm C: Docker Compose Override
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  api:
    build:
      context: ../express-js-on-vercel
    volumes:
      - ../express-js-on-vercel/.env:/app/.env:ro
```

## 📋 Deployment Checklist

### Ön Hazırlık ✅
- [ ] Docker ve Docker Compose kurulu
- [ ] Git kurulu
- [ ] Gerekli portlar açık (3000, 3001, 27017)
- [ ] Yeterli disk alanı var

### Repository Setup ✅
- [ ] Client repository clone edildi
- [ ] Express API repository clone edildi
- [ ] Doğru klasör yapısı oluşturuldu

### Konfigürasyon ✅
- [ ] mongodb.key oluşturuldu
- [ ] mongodb.key izinleri 400 set edildi
- [ ] .env dosyası oluşturuldu ve düzenlendi
- [ ] JWT_SECRET güncellendi
- [ ] Wert.io anahtarları eklendi

### Docker Setup ✅
- [ ] docker-compose.yml doğru konumda
- [ ] Build context'ler doğru
- [ ] Volume mount'lar doğru
- [ ] Network konfigürasyonu doğru

### Test ✅
- [ ] `docker-compose up -d` çalışıyor
- [ ] Tüm container'lar ayakta
- [ ] MongoDB bağlantısı çalışıyor
- [ ] API endpoint'leri erişilebilir
- [ ] Frontend yükleniyor

## 🚨 Yaygın Hatalar ve Çözümleri

### 1. Path Bulunamıyor Hatası
```bash
# Hata: build context './express-js-on-vercel' bulunamıyor
# Çözüm: Klasör yapısını kontrol et
ls -la
pwd
```

### 2. MongoDB Key Hatası
```bash
# Hata: mongodb.key permission denied
# Çözüm: İzinleri düzelt
chmod 400 mongodb.key
ls -la mongodb.key
```

### 3. Port Conflict Hatası
```bash
# Hata: Port 3000 already in use
# Çözüm: Çalışan servisleri kontrol et
sudo netstat -tulpn | grep :3000
docker ps
```

### 4. Environment Variable Hatası
```bash
# Hata: DATABASE_URL undefined
# Çözüm: .env dosyasını kontrol et
cat express-js-on-vercel/.env
```

## 🔄 Güncelleme Süreci

### Kod Güncellemesi
```bash
# Repository'leri güncelle
cd client && git pull origin main
cd ../express-js-on-vercel && git pull origin main

# Container'ları yeniden build et
docker-compose build --no-cache
docker-compose up -d
```

### Konfigürasyon Güncellemesi
```bash
# Docker Compose dosyasını güncelle
wget -O docker-compose.yml https://raw.githubusercontent.com/username/client/main/docker-compose.yml

# Servisleri yeniden başlat
docker-compose down
docker-compose up -d
```

## 📞 Sorun Giderme

### Logları İnceleme
```bash
# Tüm servislerin logları
docker-compose logs -f

# Belirli servis logları
docker-compose logs -f api
docker-compose logs -f mongodb
docker-compose logs -f client
```

### Container Durumunu Kontrol
```bash
# Container durumları
docker-compose ps

# Resource kullanımı
docker stats

# Network bağlantıları
docker network ls
docker network inspect wert-app_app-network
```

### MongoDB Bağlantı Testi
```bash
# MongoDB container'ına bağlan
docker-compose exec mongodb mongosh -u admin -p Xz0k37ZxLrwh_K-i1RjZ9 --authenticationDatabase admin

# Replica set durumu
rs.status()
```

---

## 🎯 Sonuç

Bu rehberi takip ederek uygulamanızı sunucuda başarıyla deploy edebilirsiniz. Önemli olan doğru klasör yapısını oluşturmak ve path'leri doğru konfigüre etmektir. 