# MSleuth

MSleuth is an API service for matching and fetching metadata for video game ROM files from [LaunchBox](https://www.launchbox-app.com/) and [Libretro](https://www.libretro.com/) databases. It provides two core functions:

- **Query**: Retrieve stored metadata by known LaunchBox database IDs and Libretro identifiers.
- **Sleuth**: Guess and fetch metadata for unknown or new ROM files by analyzing file names, MD5 hashes, and platform data.

## Usage
MSleuth provides a lightweight HTTP server with the following endpoints:

```
POST /api/v1/query
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

```
POST /api/v1/sleuth
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

## License
MIT
