# Wert App - Docker Compose Setup

Bu proje React frontend, Express API backend ve MongoDB database'ini Docker Compose ile birleştirir.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker
- Docker Compose

### Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

2. **Environment dosyasını oluşturun:**
```bash
cp express-js-on-vercel/env.example express-js-on-vercel/.env
```

3. **Environment değişkenlerini düzenleyin:**
```bash
# express-js-on-vercel/.env dosyasını düzenleyin
# Özellikle JWT_SECRET ve Wert.io anahtarlarını değiştirin
```

4. **Uygulamayı başlatın:**
```bash
docker-compose up -d
```

5. **Uygulamaya erişin:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- MongoDB: localhost:27017

## 📁 Proje Yapısı

```
.
├── client/                 # React Frontend
├── express-js-on-vercel/   # Express API Backend
├── docker-compose.yml      # Docker Compose konfigürasyonu
├── mongodb.key            # MongoDB authentication key
└── README.md              # Bu dosya
```

## 🔧 Servisler

### 1. MongoDB (Port: 27017)
- MongoDB 8.0.11
- Replica set konfigürasyonu
- Authentication aktif
- Persistent volume

### 2. Express API (Port: 3001)
- Node.js 20
- Prisma ORM
- JWT authentication
- CORS konfigürasyonu

### 3. React Client (Port: 3000)
- Vite build
- Nginx serving
- Production optimized

## 🛠️ Komutlar

### Uygulamayı başlatma
```bash
docker-compose up -d
```

### Logları görüntüleme
```bash
docker-compose logs -f
```

### Belirli servisin logları
```bash
docker-compose logs -f api
docker-compose logs -f client
docker-compose logs -f mongodb
```

### Uygulamayı durdurma
```bash
docker-compose down
```

### Veritabanını sıfırlama
```bash
docker-compose down -v
docker-compose up -d
```

### Servisleri yeniden başlatma
```bash
docker-compose restart
```

## 🔒 Güvenlik

### MongoDB
- Authentication aktif
- Replica set konfigürasyonu
- Key file authentication

### Environment Variables
- JWT_SECRET değiştirin
- Wert.io anahtarlarını ekleyin
- Production'da güçlü şifreler kullanın

## 🐛 Sorun Giderme

### MongoDB bağlantı sorunu
```bash
# MongoDB container'ına bağlanın
docker-compose exec mongodb mongosh -u admin -p Xz0k37ZxLrwh_K-i1RjZ9 --authenticationDatabase admin
```

### API loglarını kontrol edin
```bash
docker-compose logs api
```

### Prisma migration
```bash
docker-compose exec api npx prisma db push
```

## 📝 Notlar

- İlk çalıştırmada MongoDB replica set'inin başlatılması 10-15 saniye sürebilir
- API servisi MongoDB'nin hazır olmasını bekler
- Frontend API'ye bağlanmak için API servisinin hazır olmasını bekler

## 🔄 Production Deployment

Production'a geçerken:
1. Environment değişkenlerini güncelleyin
2. JWT_SECRET'ı değiştirin
3. Wert.io anahtarlarını ekleyin
4. MongoDB şifresini değiştirin
5. SSL sertifikaları ekleyin
6. Reverse proxy konfigürasyonu yapın
