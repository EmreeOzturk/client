# 🧪 Build Test Komutları

## 🔧 Sorun Çözümü
- `prisma` CLI'yi dependencies'e taşıdık
- Dockerfile'da `--ignore-scripts` flag'i eklendi
- Production stage'inde Prisma client manuel generate ediliyor

## 🚀 Test Komutları

### 1. Cache Temizle ve Build Et
```bash
# Tüm container'ları durdur
docker compose down

# Image'ları temizle
docker system prune -f

# Cache'siz build et
docker compose -f docker-compose.http.yml build --no-cache

# Servisleri başlat
docker compose -f docker-compose.http.yml up -d
```

### 2. Build Loglarını İzle
```bash
# API build loglarını izle
docker compose -f docker-compose.http.yml logs -f api

# Tüm servislerin loglarını izle
docker compose -f docker-compose.http.yml logs -f
```

### 3. Manuel API Build Test
```bash
# Sadece API'yi build et
docker compose -f docker-compose.http.yml build api

# API container'ını başlat
docker compose -f docker-compose.http.yml up api
```

### 4. Container İçinde Debug
```bash
# API container'ına gir
docker compose -f docker-compose.http.yml exec api sh

# Prisma CLI'nin varlığını kontrol et
which prisma
prisma --version

# Node modules'u kontrol et
ls -la node_modules/.bin/prisma
```

## 🔍 Hata Durumunda

### Eğer hala prisma bulunamıyor hatası alırsan:
```bash
# Package.json'ı kontrol et
cat express-js-on-vercel/package.json | grep prisma

# pnpm-lock.yaml'ı yenile
cd express-js-on-vercel
rm pnpm-lock.yaml
pnpm install
cd ..
```

### Alternative Dockerfile (son çare):
```dockerfile
# Production stage'inde tüm dependencies kur
RUN pnpm install --frozen-lockfile
```

Bu yaklaşım daha fazla yer kaplar ama garanti çalışır. 