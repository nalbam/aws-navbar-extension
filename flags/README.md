# AWS Region Flags

## Source

Flag images are from **Google Noto Color Emoji** via [Emojipedia](https://emojipedia.org/flags).

## How to Download

### URL Pattern

```
https://em-content.zobj.net/source/google/439/flag-{country-name}_{unicode}.png
```

### Examples

```bash
# Country flags
curl -sL "https://em-content.zobj.net/source/google/439/flag-south-korea_1f1f0-1f1f7.png" -o south-korea.png
curl -sL "https://em-content.zobj.net/source/google/439/flag-japan_1f1ef-1f1f5.png" -o japan.png
curl -sL "https://em-content.zobj.net/source/google/439/flag-united-states_1f1fa-1f1f8.png" -o united-states.png

# Global (globe emoji)
curl -sL "https://em-content.zobj.net/source/google/439/globe-showing-asia-australia_1f30f.png" -o global.png
```

### Unicode Reference

| Country Code | Unicode |
|--------------|---------|
| AU (Australia) | 1f1e6-1f1fa |
| BH (Bahrain) | 1f1e7-1f1ed |
| BR (Brazil) | 1f1e7-1f1f7 |
| CA (Canada) | 1f1e8-1f1e6 |
| CH (Switzerland) | 1f1e8-1f1ed |
| DE (Germany) | 1f1e9-1f1ea |
| ES (Spain) | 1f1ea-1f1f8 |
| FR (France) | 1f1eb-1f1f7 |
| GB (United Kingdom) | 1f1ec-1f1e7 |
| HK (Hong Kong) | 1f1ed-1f1f0 |
| ID (Indonesia) | 1f1ee-1f1e9 |
| IE (Ireland) | 1f1ee-1f1ea |
| IL (Israel) | 1f1ee-1f1f1 |
| IN (India) | 1f1ee-1f1f3 |
| IT (Italy) | 1f1ee-1f1f9 |
| JP (Japan) | 1f1ef-1f1f5 |
| KR (South Korea) | 1f1f0-1f1f7 |
| MX (Mexico) | 1f1f2-1f1fd |
| MY (Malaysia) | 1f1f2-1f1fe |
| NZ (New Zealand) | 1f1f3-1f1ff |
| SE (Sweden) | 1f1f8-1f1ea |
| SG (Singapore) | 1f1f8-1f1ec |
| TH (Thailand) | 1f1f9-1f1ed |
| TW (Taiwan) | 1f1f9-1f1fc |
| AE (UAE) | 1f1e6-1f1ea |
| US (United States) | 1f1fa-1f1f8 |
| ZA (South Africa) | 1f1ff-1f1e6 |

### Resize to 128x128

```bash
# macOS (using sips)
for f in *.png; do sips -z 128 128 "$f" --out "$f"; done

# Linux (using ImageMagick)
for f in *.png; do convert "$f" -resize 128x128 "$f"; done
```

## Flag List

| Country | Flag | AWS Regions |
|---------|------|-------------|
| Australia | ![australia](australia.png) | ap-southeast-2, ap-southeast-4 |
| Bahrain | ![bahrain](bahrain.png) | me-south-1 |
| Brazil | ![brazil](brazil.png) | sa-east-1 |
| Canada | ![canada](canada.png) | ca-central-1, ca-west-1 |
| France | ![france](france.png) | eu-west-3 |
| Germany | ![germany](germany.png) | eu-central-1 |
| Global | ![global](global.png) | global |
| Hong Kong | ![hong-kong](hong-kong.png) | ap-east-1 |
| India | ![india](india.png) | ap-south-1, ap-south-2 |
| Indonesia | ![indonesia](indonesia.png) | ap-southeast-3 |
| Ireland | ![ireland](ireland.png) | eu-west-1 |
| Israel | ![israel](israel.png) | il-central-1 |
| Italy | ![italy](italy.png) | eu-south-1, eu-south-3 |
| Japan | ![japan](japan.png) | ap-northeast-1, ap-northeast-3 |
| Malaysia | ![malaysia](malaysia.png) | ap-southeast-5 |
| Mexico | ![mexico](mexico.png) | mx-central-1 |
| New Zealand | ![new-zealand](new-zealand.png) | ap-southeast-6 |
| Singapore | ![singapore](singapore.png) | ap-southeast-1 |
| South Africa | ![south-africa](south-africa.png) | af-south-1 |
| South Korea | ![south-korea](south-korea.png) | ap-northeast-2 |
| Spain | ![spain](spain.png) | eu-south-2 |
| Sweden | ![sweden](sweden.png) | eu-north-1 |
| Switzerland | ![switzerland](switzerland.png) | eu-central-2, eu-central-3 |
| Taiwan | ![taiwan](taiwan.png) | ap-east-2 |
| Thailand | ![thailand](thailand.png) | ap-southeast-7 |
| UAE | ![uae](uae.png) | me-central-1, me-west-1 |
| United Kingdom | ![united-kingdom](united-kingdom.png) | eu-west-2 |
| United States | ![united-states](united-states.png) | us-east-1, us-east-2, us-west-1, us-west-2 |
