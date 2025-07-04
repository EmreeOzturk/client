# MongoDB Key Dosyası Güvenlik Rehberi

## 🔐 MongoDB.key Dosyası Hakkında

`mongodb.key` dosyası MongoDB replica set authentication için kritik bir güvenlik dosyasıdır.

## ⚠️ GÜVENLİK UYARILARI

### 🚫 ASLA YAPMAYIN:
- Bu dosyayı Git repository'sine commit etmeyin
- Public repository'lerde paylaşmayın
- Container image'a dahil etmeyin
- Email veya chat'te paylaşmayın

### ✅ DOĞRU YAKLAŞIM:
- Dosyayı host sistem'de güvenli tutun
- Docker volume mount ile container'a verin
- Dosya izinlerini 400 (read-only owner) yapın
- Production'da güçlü bir key oluşturun

## 📁 Dosya Konumları

### Development
```
/Users/aydin/Desktop/express-js-on-vercel/mongodb.key
```

### Production
```
/etc/mongodb/mongodb.key  # Container içinde
./mongodb.key            # Host'ta
```

## 🛠️ Key Oluşturma

### Yeni Key Oluşturma
```bash
openssl rand -base64 756 > mongodb.key
chmod 400 mongodb.key
```

### Key Kontrolü
```bash
ls -la mongodb.key
# Çıktı: -r-------- 1 user user 1024 date mongodb.key
```

## 🐳 Docker Kullanımı

### Docker Compose'da
```yaml
services:
  mongodb:
    volumes:
      - ./mongodb.key:/etc/mongodb/mongodb.key:ro
    user: "999:999"
```

### Manuel Docker
```bash
docker run -v $(pwd)/mongodb.key:/etc/mongodb/mongodb.key:ro mongo
```

## 🔄 Üretim Ortamı

### 1. Güvenli Key Oluşturma
```bash
openssl rand -base64 756 > /secure/path/mongodb.key
chmod 400 /secure/path/mongodb.key
chown mongodb:mongodb /secure/path/mongodb.key
```

### 2. Docker Compose Güncellemesi
```yaml
volumes:
  - /secure/path/mongodb.key:/etc/mongodb/mongodb.key:ro
```

### 3. Backup Stratejisi
- Key'i güvenli bir yerde yedekleyin
- Encrypted storage kullanın
- Offline backup yapın

## 🚨 Güvenlik İhlali Durumunda

### Hemen Yapılacaklar:
1. Tüm MongoDB instance'larını durdurun
2. Yeni key oluşturun
3. Tüm node'larda key'i güncelleyin
4. Replica set'i yeniden başlatın
5. Log'ları inceleyin

### Kontrol Komutları:
```bash
# MongoDB bağlantısını test et
mongosh --host localhost:27017 -u admin -p password

# Replica set durumunu kontrol et
rs.status()

# Authentication test
db.runCommand({connectionStatus: 1})
```

## 📋 Checklist

### Development ✅
- [x] mongodb.key oluşturuldu
- [x] Dosya izinleri 400 set edildi
- [x] .gitignore'a eklendi
- [x] .dockerignore'a eklendi

### Production ❗
- [ ] Güvenli lokasyonda key oluştur
- [ ] Backup strategy belirle
- [ ] Monitoring kur
- [ ] Access log'ları aktifleştir
- [ ] Key rotation planı yap

## 📞 Sorun Durumunda

Eğer key ile ilgili problem yaşarsanız:

1. Container log'larını kontrol edin:
   ```bash
   docker-compose logs mongodb
   ```

2. Key dosyası izinlerini kontrol edin:
   ```bash
   ls -la mongodb.key
   ```

3. Key dosyası formatını kontrol edin:
   ```bash
   wc -c mongodb.key  # ~1024 bytes olmalı
   ```

---
**Not:** Bu dosya güvenlik rehberidir, mongodb.key dosyasının kendisi değildir! 