# Anket Oluşturma Uygulaması

Modern ve kullanıcı dostu bir anket oluşturma ve yönetim arayüzü - 2025'e hazır! ✨

## Özellikler

- 🎨 **2025 Modern UI**: Glassmorphism, gradient'ler ve smooth animasyonlar
- ✨ **Tailwind CSS v4**: En yeni teknoloji ile şık ve responsive tasarım
- 📝 **3 Soru Tipi**: 
  - ○ Tek Seçim (Radio Button)
  - ☑ Çoklu Seçim (Checkbox - Birden fazla)
  - ✏️ Açık Uçlu (Metin alanı)
- 📋 **Çoklu Anket Yönetimi**: İstediğiniz kadar anket oluşturun ve yönetin
- 🔄 **Soru Sıralama**: Soruları yukarı/aşağı taşıyarak yeniden sıralayın
- 👁️ **Önizleme Modu**: Anketlerin nasıl görüneceğini test edin
- 💾 **Otomatik Kaydetme**: Tüm verileriniz tarayıcıda otomatik olarak saklanır
- 🔍 **Arama**: Anketlerinizi başlık veya açıklamaya göre arayın
- ⚡ **Zorunlu Alan Kontrolü**: Zorunlu soruları işaretleyin
- 🌊 **Animasyonlu Arka Plan**: Canlı gradient blob animasyonları
- 🎯 **Hover Efektleri**: İnteraktif ve modern kullanıcı deneyimi

## Teknolojiler

- **React**: UI bileşenleri için
- **Vite**: Hızlı geliştirme ve build
- **Tailwind CSS**: Modern stil yaklaşımı
- **Zustand**: Basit ve etkili state yönetimi

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## Kullanım

1. **Yeni Anket Oluştur**: Ana sayfada "Yeni Anket Oluştur" butonuna tıklayın
2. **Anket Bilgilerini Girin**: Başlık ve açıklama ekleyin
3. **Soru Ekleyin**: "Soru Ekle" butonuyla çoktan seçmeli veya açık uçlu sorular ekleyin
4. **Düzenleyin**: Soruları düzenleyin, silin veya yeniden sıralayın
5. **Önizleyin**: Anketin nasıl görüneceğini ve cevaplanacağını görün
6. **Yönetin**: Ana sayfadan tüm anketlerinizi görüntüleyin ve yönetin

## İki Ayrı Mod

### 📝 Düzenleme Modu
- Anket başlığı ve açıklama düzenleme
- Soru ekleme, silme ve düzenleme
- Soruları yukarı/aşağı taşıma
- Çoktan seçmeli ve açık uçlu soru tipleri

### 👁️ Önizleme Modu
- Anketin gerçek görünümünü görün
- Soruları cevaplayabilir ve test edebilirsiniz
- Zorunlu alan kontrolü
- Başarılı gönderim ekranı
- Düzenleme moduna hızlı geçiş

## Proje Yapısı

```
src/
├── components/
│   ├── SurveyList.jsx          # Anket listesi ve arama
│   ├── SurveyEditor.jsx        # Anket düzenleme arayüzü
│   ├── SurveyPreview.jsx       # Anket önizleme ve cevaplama
│   ├── QuestionEditor.jsx      # Soru ekleme/düzenleme formu
│   └── CreateSurveyModal.jsx   # Yeni anket oluşturma modal
├── store/
│   └── surveyStore.js          # Zustand state yönetimi
├── App.jsx                      # Ana uygulama bileşeni
└── index.css                    # Tailwind CSS ve animasyonlar
```

## Özellik Detayları

### Soru Tipleri

#### 🔵 Tek Seçim (Radio Button)
- Kullanıcı sadece bir seçenek seçebilir
- En az 2 seçenek gereklidir
- İstenildiği kadar seçenek eklenebilir
- Seçenekler A, B, C... şeklinde etiketlenir
- Mavi renkli tasarım

#### 🟢 Çoklu Seçim (Checkbox)
- Kullanıcı birden fazla seçenek seçebilir
- En az 2 seçenek gereklidir
- İstenildiği kadar seçenek eklenebilir
- Yeşil (emerald) renkli tasarım
- Zorunlu sorularda en az 1 seçim gerekir

#### 🟣 Açık Uçlu
- Kullanıcılar serbest metin girebilir
- Detaylı geri bildirim almak için ideal
- Mor renkli tasarım

### Soru Yönetimi
- Soruları yukarı/aşağı hareket ettirin
- Düzenle veya sil
- Zorunlu/opsiyonel olarak işaretleyin
- Her soru tipi için farklı renk kodlaması

## Lisans

MIT
