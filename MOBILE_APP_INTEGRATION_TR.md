Mükemmel! Mobil uygulama entegrasyonu için detaylı bir Türkçe dokümantasyon hazırlıyorum. Bu, arkadaşınızın survey'leri nasıl çekeceğini ve data formatlarını açıklayacak.

[1 tool called]

İşte mobil uygulama entegrasyonu için hazırladığım detaylı Türkçe dokümantasyon. Bunu bir dosyaya kaydedebilirsiniz:

---

# Mobil Uygulama Entegrasyon Dokümantasyonu

## 📱 Survey Builder - Mobil Uygulama API Dokümantasyonu

Bu dokümantasyon, mobil uygulamanızdan yayınlanmış (published) anketleri nasıl çekeceğinizi ve data formatlarını açıklar.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Kurulum](#kurulum)
3. [Temel Kullanım](#temel-kullanım)
4. [Data Formatları](#data-formatları)
5. [Örnek Sorgular](#örnek-sorgular)
6. [Soru Tipleri](#soru-tipleri)
7. [Örnek Response'lar](#örnek-responselar)
8. [Hata Yönetimi](#hata-yönetimi)

---

## 🎯 Genel Bakış

Survey Builder uygulaması, anketleri Supabase PostgreSQL veritabanında saklar. Mobil uygulama, Supabase JavaScript client kullanarak bu anketleri çekebilir.

### Önemli Bilgiler

- **Veritabanı**: Supabase PostgreSQL
- **Tablo Adı**: `surveys`
- **Erişim Yöntemi**: Supabase JavaScript Client
- **Sadece Yayınlanmış Anketler**: `published = true` olan anketler mobil uygulamada görünür
- **Authentication**: Gerekmez (anon key yeterli)

---

## 🔧 Kurulum

### React Native için

```bash
npm install @supabase/supabase-js
```

### Flutter için

```yaml
dependencies:
  supabase_flutter: ^2.0.0
```

### iOS (Swift) için

```ruby
# Podfile
pod 'Supabase'
```

### Android (Kotlin) için

```gradle
// build.gradle
implementation 'io.github.jan-tennert.supabase:postgrest-kt:2.0.0'
```

---

## 🚀 Temel Kullanım

### JavaScript/React Native

```javascript
import { createClient } from '@supabase/supabase-js'

// Supabase bağlantısı
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tüm yayınlanmış anketleri çek
async function getPublishedSurveys() {
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  
  if (error) {
    console.error('Hata:', error)
    return null
  }
  
  return data
}

// Belirli bir anketi çek
async function getSurveyById(surveyId) {
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', surveyId)
    .eq('published', true)
    .single()
  
  if (error) {
    console.error('Hata:', error)
    return null
  }
  
  return data
}
```

### Flutter/Dart

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

// Supabase başlatma
await Supabase.initialize(
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key',
);

final supabase = Supabase.instance.client;

// Tüm yayınlanmış anketleri çek
Future<List<dynamic>> getPublishedSurveys() async {
  final response = await supabase
      .from('surveys')
      .select()
      .eq('published', true)
      .order('published_at', ascending: false);
  
  return response;
}

// Belirli bir anketi çek
Future<Map<String, dynamic>?> getSurveyById(String surveyId) async {
  final response = await supabase
      .from('surveys')
      .select()
      .eq('id', surveyId)
      .eq('published', true)
      .single();
  
  return response;
}
```

---

## 📊 Data Formatları

### Survey Objesi (Ana Yapı)

```typescript
interface Survey {
  id: string;                    // UUID - Anketin benzersiz ID'si
  user_id: string;               // UUID - Anketi oluşturan kullanıcının ID'si
  title: string;                 // Anket başlığı
  description: string | null;    // Anket açıklaması
  tags: string[];                // Etiket dizisi (örn: ["müşteri", "memnuniyet"])
  questions: Question[];         // Soru dizisi (JSONB)
  question_groups: QuestionGroup[]; // Soru grupları dizisi (JSONB)
  published: boolean;            // Yayında mı? (true/false)
  published_at: string | null;   // Yayınlanma zamanı (ISO 8601)
  created_at: string;            // Oluşturulma zamanı (ISO 8601)
  updated_at: string;            // Son güncelleme zamanı (ISO 8601)
}
```

### Question Objesi (Soru Yapısı)

```typescript
interface Question {
  id: string;                    // Sorunun benzersiz ID'si
  type: QuestionType;            // Soru tipi (aşağıda detaylı)
  text: string;                  // Soru metni
  required: boolean;             // Zorunlu mu?
  order: number;                 // Sıralama numarası
  groupId: string | null;        // Ait olduğu grup ID'si (varsa)
  
  // Seçenekli sorular için (multiple-choice, multiple-select, dropdown)
  options?: string[];            // Seçenek dizisi
  
  // Ölçek soruları için (rating-scale, linear-scale)
  minScale?: number;             // Minimum değer
  maxScale?: number;             // Maximum değer
  minLabel?: string;             // Minimum etiket (opsiyonel)
  maxLabel?: string;             // Maximum etiket (opsiyonel)
}
```

### QuestionType (Soru Tipleri)

```typescript
type QuestionType = 
  | 'multiple-choice'    // Tek seçim (radio button)
  | 'multiple-select'    // Çoklu seçim (checkbox)
  | 'dropdown'           // Açılır liste
  | 'open-ended'         // Açık uçlu metin
  | 'rating-scale'       // Yıldız derecelendirme
  | 'linear-scale'       // Sayısal ölçek
  | 'date'               // Tarih seçici
  | 'time';              // Saat seçici
```

### QuestionGroup Objesi (Soru Grubu)

```typescript
interface QuestionGroup {
  id: string;            // Grup ID'si
  name: string;          // Grup adı
  description: string;   // Grup açıklaması
  order: number;         // Sıralama numarası
}
```

---

## 📝 Örnek Sorgular

### 1. Tüm Yayınlanmış Anketleri Getir

```javascript
const { data: surveys } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false })
```

### 2. Belirli Bir Etikete Sahip Anketleri Getir

```javascript
const { data: surveys } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .contains('tags', ['müşteri'])
```

### 3. En Son Yayınlanan 10 Anketi Getir

```javascript
const { data: surveys } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false })
  .limit(10)
```

### 4. Belirli Tarihten Sonra Yayınlanan Anketleri Getir

```javascript
const { data: surveys } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .gte('published_at', '2025-01-01')
  .order('published_at', { ascending: false })
```

### 5. Başlıkta Belirli Kelime Geçen Anketleri Ara

```javascript
const { data: surveys } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .ilike('title', '%memnuniyet%')
```

---

## 🎨 Soru Tipleri Detaylı Açıklama

### 1. Multiple Choice (Tek Seçim)

```json
{
  "id": "q1",
  "type": "multiple-choice",
  "text": "En çok hangi ürünümüzü kullanıyorsunuz?",
  "required": true,
  "order": 0,
  "groupId": null,
  "options": [
    "Ürün A",
    "Ürün B",
    "Ürün C",
    "Diğer"
  ]
}
```

**Nasıl Gösterilir**: Radio button grubu
**Cevap Formatı**: Tek bir string (örn: "Ürün A")

### 2. Multiple Select (Çoklu Seçim)

```json
{
  "id": "q2",
  "type": "multiple-select",
  "text": "Hangi özellikleri kullanıyorsunuz? (Birden fazla seçebilirsiniz)",
  "required": false,
  "order": 1,
  "groupId": null,
  "options": [
    "Özellik 1",
    "Özellik 2",
    "Özellik 3",
    "Özellik 4"
  ]
}
```

**Nasıl Gösterilir**: Checkbox grubu
**Cevap Formatı**: String dizisi (örn: ["Özellik 1", "Özellik 3"])

### 3. Dropdown (Açılır Liste)

```json
{
  "id": "q3",
  "type": "dropdown",
  "text": "Yaş aralığınız nedir?",
  "required": true,
  "order": 2,
  "groupId": null,
  "options": [
    "18-25",
    "26-35",
    "36-45",
    "46-55",
    "56+"
  ]
}
```

**Nasıl Gösterilir**: Dropdown/Picker
**Cevap Formatı**: Tek bir string

### 4. Open-ended (Açık Uçlu)

```json
{
  "id": "q4",
  "type": "open-ended",
  "text": "Ürünümüz hakkında görüşlerinizi paylaşır mısınız?",
  "required": false,
  "order": 3,
  "groupId": null
}
```

**Nasıl Gösterilir**: Text area / Multiline input
**Cevap Formatı**: String (uzun metin)

### 5. Rating Scale (Yıldız Derecelendirme)

```json
{
  "id": "q5",
  "type": "rating-scale",
  "text": "Müşteri hizmetlerimizi değerlendirir misiniz?",
  "required": true,
  "order": 4,
  "groupId": null,
  "minScale": 1,
  "maxScale": 5,
  "minLabel": "Çok Kötü",
  "maxLabel": "Mükemmel"
}
```

**Nasıl Gösterilir**: Yıldız veya emojiler
**Cevap Formatı**: Number (1-5 arası)

### 6. Linear Scale (Sayısal Ölçek)

```json
{
  "id": "q6",
  "type": "linear-scale",
  "text": "Ürünümüzü bir arkadaşınıza tavsiye eder misiniz?",
  "required": true,
  "order": 5,
  "groupId": null,
  "minScale": 0,
  "maxScale": 10,
  "minLabel": "Kesinlikle Hayır",
  "maxLabel": "Kesinlikle Evet"
}
```

**Nasıl Gösterilir**: Slider veya number picker
**Cevap Formatı**: Number (0-10 arası)

### 7. Date (Tarih)

```json
{
  "id": "q7",
  "type": "date",
  "text": "Son kullanım tarihiniz nedir?",
  "required": false,
  "order": 6,
  "groupId": null
}
```

**Nasıl Gösterilir**: Date picker
**Cevap Formatı**: ISO 8601 string (örn: "2025-11-26")

### 8. Time (Saat)

```json
{
  "id": "q8",
  "type": "time",
  "text": "Genelde saat kaçta kullanıyorsunuz?",
  "required": false,
  "order": 7,
  "groupId": null
}
```

**Nasıl Gösterilir**: Time picker
**Cevap Formatı**: HH:MM formatında string (örn: "14:30")

---

## 📦 Örnek Response'lar

### Tam Bir Anket Örneği

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Müşteri Memnuniyet Anketi 2025",
  "description": "Hizmetlerimizi geliştirmek için görüşlerinize ihtiyacımız var",
  "tags": ["müşteri", "memnuniyet", "2025"],
  "published": true,
  "published_at": "2025-11-26T10:30:00.000Z",
  "created_at": "2025-11-20T08:00:00.000Z",
  "updated_at": "2025-11-26T10:30:00.000Z",
  "question_groups": [
    {
      "id": "g1",
      "name": "Genel Sorular",
      "description": "Genel bilgiler",
      "order": 0
    },
    {
      "id": "g2",
      "name": "Memnuniyet Soruları",
      "description": "Deneyiminiz hakkında",
      "order": 1
    }
  ],
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "text": "Yaş aralığınız nedir?",
      "required": true,
      "order": 0,
      "groupId": "g1",
      "options": ["18-25", "26-35", "36-45", "46-55", "56+"]
    },
    {
      "id": "q2",
      "type": "rating-scale",
      "text": "Genel memnuniyet düzeyiniz nedir?",
      "required": true,
      "order": 1,
      "groupId": "g2",
      "minScale": 1,
      "maxScale": 5,
      "minLabel": "Çok Memnun Değilim",
      "maxLabel": "Çok Memnunum"
    },
    {
      "id": "q3",
      "type": "multiple-select",
      "text": "Hangi özellikleri beğendiniz?",
      "required": false,
      "order": 2,
      "groupId": "g2",
      "options": [
        "Kullanım kolaylığı",
        "Hız",
        "Tasarım",
        "Müşteri desteği"
      ]
    },
    {
      "id": "q4",
      "type": "open-ended",
      "text": "Önerileriniz nelerdir?",
      "required": false,
      "order": 3,
      "groupId": null
    }
  ]
}
```

### Minimal Anket Örneği

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Hızlı Geri Bildirim",
  "description": null,
  "tags": [],
  "published": true,
  "published_at": "2025-11-26T11:00:00.000Z",
  "created_at": "2025-11-26T10:45:00.000Z",
  "updated_at": "2025-11-26T11:00:00.000Z",
  "question_groups": [],
  "questions": [
    {
      "id": "q1",
      "type": "rating-scale",
      "text": "Bu hizmeti nasıl değerlendirirsiniz?",
      "required": true,
      "order": 0,
      "groupId": null,
      "minScale": 1,
      "maxScale": 5
    }
  ]
}
```

---

## 🎯 Mobil Uygulamada Kullanım Örnekleri

### React Native ile Tam Örnek

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setSurveys(data);
    } catch (error) {
      console.error('Anketler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSurvey = ({ item }) => (
    <TouchableOpacity onPress={() => openSurvey(item.id)}>
      <View style={styles.surveyCard}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        <Text style={styles.questionCount}>
          {item.questions.length} Soru
        </Text>
        {item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={surveys}
      renderItem={renderSurvey}
      keyExtractor={item => item.id}
      refreshing={loading}
      onRefresh={loadSurveys}
    />
  );
}
```

### Soruları Render Etme Örneği

```javascript
function QuestionRenderer({ question }) {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <View>
          <Text>{question.text}</Text>
          {question.options.map((option, index) => (
            <RadioButton key={index} label={option} />
          ))}
        </View>
      );

    case 'multiple-select':
      return (
        <View>
          <Text>{question.text}</Text>
          {question.options.map((option, index) => (
            <CheckBox key={index} label={option} />
          ))}
        </View>
      );

    case 'rating-scale':
      return (
        <View>
          <Text>{question.text}</Text>
          <StarRating
            min={question.minScale}
            max={question.maxScale}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
          />
        </View>
      );

    case 'linear-scale':
      return (
        <View>
          <Text>{question.text}</Text>
          <Slider
            minimumValue={question.minScale}
            maximumValue={question.maxScale}
          />
          {question.minLabel && <Text>{question.minLabel}</Text>}
          {question.maxLabel && <Text>{question.maxLabel}</Text>}
        </View>
      );

    case 'open-ended':
      return (
        <View>
          <Text>{question.text}</Text>
          <TextInput multiline />
        </View>
      );

    case 'date':
      return (
        <View>
          <Text>{question.text}</Text>
          <DatePicker />
        </View>
      );

    case 'time':
      return (
        <View>
          <Text>{question.text}</Text>
          <TimePicker />
        </View>
      );

    case 'dropdown':
      return (
        <View>
          <Text>{question.text}</Text>
          <Picker>
            {question.options.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      );

    default:
      return null;
  }
}
```

---

## ⚠️ Hata Yönetimi

### Yaygın Hatalar ve Çözümleri

```javascript
async function getSurveysWithErrorHandling() {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      // Supabase hatası
      if (error.code === 'PGRST116') {
        console.error('Tablo bulunamadı');
      } else if (error.code === 'PGRST301') {
        console.error('Yetki hatası');
      } else {
        console.error('Veritabanı hatası:', error.message);
      }
      return null;
    }

    if (!data || data.length === 0) {
      console.log('Henüz yayınlanmış anket yok');
      return [];
    }

    return data;

  } catch (err) {
    // Network hatası veya beklenmeyen hata
    console.error('Bağlantı hatası:', err);
    return null;
  }
}
```

---

## 🔄 Real-time Güncellemeler (Opsiyonel)

Yeni anket yayınlandığında otomatik bildirim almak için:

```javascript
// Real-time subscription
const subscription = supabase
  .channel('surveys-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'surveys',
      filter: 'published=eq.true'
    },
    (payload) => {
      console.log('Yeni anket yayınlandı:', payload.new);
      // Listeyi güncelle
      loadSurveys();
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## 📱 Platform-Specific Örnekler

### Flutter Örneği

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

class SurveyService {
  final _client = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getPublishedSurveys() async {
    try {
      final response = await _client
          .from('surveys')
          .select()
          .eq('published', true)
          .order('published_at', ascending: false);
      
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Hata: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>?> getSurveyById(String id) async {
    try {
      final response = await _client
          .from('surveys')
          .select()
          .eq('id', id)
          .eq('published', true)
          .single();
      
      return response;
    } catch (e) {
      print('Hata: $e');
      return null;
    }
  }
}

// Kullanımı
class SurveyListScreen extends StatefulWidget {
  @override
  _SurveyListScreenState createState() => _SurveyListScreenState();
}

class _SurveyListScreenState extends State<SurveyListScreen> {
  List<Map<String, dynamic>> surveys = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadSurveys();
  }

  Future<void> loadSurveys() async {
    final service = SurveyService();
    final data = await service.getPublishedSurveys();
    setState(() {
      surveys = data;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Center(child: CircularProgressIndicator());
    }

    return ListView.builder(
      itemCount: surveys.length,
      itemBuilder: (context, index) {
        final survey = surveys[index];
        return ListTile(
          title: Text(survey['title']),
          subtitle: Text(survey['description'] ?? ''),
          trailing: Text('${survey['questions'].length} soru'),
          onTap: () => openSurvey(survey['id']),
        );
      },
    );
  }
}
```

---

## 🔐 Güvenlik Notları

1. **Anon Key Kullanımı**: Mobil uygulamada sadece `anon` key kullanın, `service_role` key'i asla kullanmayın
2. **HTTPS**: Tüm istekler otomatik olarak HTTPS üzerinden yapılır
3. **Row Level Security**: Veritabanında RLS aktif, sadece published=true anketler görünür
4. **API Key Güvenliği**: Anon key'i kod içinde saklayabilirsiniz, güvenlidir

---

## 📊 Performans İpuçları

### 1. Sadece Gerekli Alanları Çekin

```javascript
// ❌ Kötü - Tüm alanları çeker
const { data } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true);

// ✅ İyi - Sadece gerekli alanlar
const { data } = await supabase
  .from('surveys')
  .select('id, title, description, questions, tags')
  .eq('published', true);
```

### 2. Pagination Kullanın

```javascript
const PAGE_SIZE = 10;

const { data } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .range(0, PAGE_SIZE - 1);
```

### 3. Cache Kullanın

```javascript
let cachedSurveys = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

async function getSurveysWithCache() {
  const now = Date.now();
  
  if (cachedSurveys && cacheTime && (now - cacheTime < CACHE_DURATION)) {
    return cachedSurveys;
  }
  
  const { data } = await supabase
    .from('surveys')
    .select('*')
    .eq('published', true);
  
  cachedSurveys = data;
  cacheTime = now;
  
  return data;
}
```

---

## 🎓 Önemli Notlar

1. **Tarih Formatı**: Tüm tarihler ISO 8601 formatındadır (`2025-11-26T10:30:00.000Z`)
2. **UUID'ler**: Tüm ID'ler UUID formatındadır
3. **Null Değerler**: `description`, `groupId`, `minLabel`, `maxLabel` gibi alanlar null olabilir
4. **JSONB Alanlar**: `questions` ve `question_groups` JSONB olarak saklanır, JavaScript objesi olarak gelir
5. **Array Alanlar**: `tags` ve `options` array olarak gelir

---

## 📞 Destek ve Yardım

### Supabase Kaynakları
- **Dokümantasyon**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Flutter SDK**: https://supabase.com/docs/reference/dart

### Örnek Projeler
- React Native: https://github.com/supabase/supabase/tree/master/examples/react-native-expo
- Flutter: https://github.com/supabase/supabase/tree/master/examples/flutter

---

## ✅ Checklist: Mobil Entegrasyon

- [ ] Supabase SDK yüklendi
- [ ] Supabase URL ve Anon Key alındı
- [ ] Supabase client yapılandırıldı
- [ ] Published anketleri çekme testi yapıldı
- [ ] Tüm soru tiplerini render edecek componentler hazırlandı
- [ ] Hata yönetimi eklendi
- [ ] Loading state'leri eklendi
- [ ] Cevapları kaydetme sistemi hazırlandı
- [ ] Offline mod (varsa) eklendi
- [ ] Test edildi ve çalışıyor

---

**Son Güncelleme**: 26 Kasım 2025
**Versiyon**: 1.0

---

Bu dokümantasyonu `MOBILE_APP_INTEGRATION_TR.md` olarak kaydedin. Sorunuz varsa lütfen sorun! 🚀