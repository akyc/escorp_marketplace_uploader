# escorp_marketplace_uploader

Загрузка картинок для маркетgлейсов в imgbb.com с сохранением данных об изображении в Supabase.

Для запросов в imgbb.com использовать `REACT_APP_IMBB_API_KEY` в `.env`.

Ответ imgbb.com на POST запрос с изображением `image.jpg`.
[Документация](https://api.imgbb.com/).

```code
{
    "data": {
        "id": "Rg2FNxV",
        "title": "image",
        "url_viewer": "https://ibb.co/Rg2FNxV",
        "url": "https://i.ibb.co/gry2d5B/image.jpg",
        "display_url": "https://i.ibb.co/j8hNzc1/image.jpg",
        "width": 1200,
        "height": 1200,
        "size": 356317,
        "time": 1723197952,
        "expiration": 44640,
        "image": {
            "filename": "image.jpg",
            "name": "image",
            "mime": "image/jpeg",
            "extension": "jpg",
            "url": "https://i.ibb.co/gry2d5B/image.jpg"
        },
        "thumb": {
            "filename": "image.jpg",
            "name": "image",
            "mime": "image/jpeg",
            "extension": "jpg",
            "url": "https://i.ibb.co/Rg2FNxV/image.jpg"
        },
        "medium": {
            "filename": "image.jpg",
            "name": "image",
            "mime": "image/jpeg",
            "extension": "jpg",
            "url": "https://i.ibb.co/j8hNzc1/image.jpg"
        },
        "delete_url": "https://ibb.co/Rg2FNxV/80dd31888e9736743666fe0cd160f124"
    },
    "success": true,
    "status": 200
}
```

Для запросов в Supabase использовать `REACT_APP_SUPABASE_URL` и `REACT_APP_SUPABASE_ANON_KEY` в `.env`.
[Документация](https://supabase.com/docs/reference/javascript/introduction)

```
const supabase = createClient(supabaseUrl, supabaseKey);

//Read rows
let { data, error } = await supabase
  .from('uploaded_files')
  .select('*')

//Insert rows
const { data, error } = await supabase
  .from('uploaded_files')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()

```
