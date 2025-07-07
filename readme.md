<p align="center">
  <img src="docs/msleuth.png" alt="logo" width="100" height="100">
  <h1 align="center">MSleuth</h1>
</p>

MSleuth is an API service for matching and fetching metadata for video game ROM files from [LaunchBox](https://www.launchbox-app.com/) and [Libretro](https://www.libretro.com/) databases. It provides two core functions:

- **Identify**: Retrieve stored metadata by known LaunchBox database IDs and Libretro identifiers.
- **Sleuth**: Guess and fetch metadata for unknown or new ROM files by analyzing file names, MD5 hashes, and platform data.

## Usage
MSleuth provides a lightweight HTTP server with the following endpoints:

```
POST https://msleuth.arianrhodsandlot.workers.dev/api/v1/metadata/identify
Body: {
  "platform": "nes",
  "files": [
    {
      "name": "game.nes",
      "md5": "abc123..." // optional
    }
  ]
}
Response: [{ launchbox: {...}, libretro: {...} }]
```

```
POST https://msleuth.arianrhodsandlot.workers.dev/api/v1/metadata/query
Body: {
  "conditions": [
    {
      "launchboxId": 123,
      "libretroId": "abc"
    }
  ]
}
Response: [{ launchbox: {...}, libretro: {...} }]
```

## License
MIT
