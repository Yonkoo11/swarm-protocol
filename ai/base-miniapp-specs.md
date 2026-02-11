# Base Miniapp Technical Specs

## Manifest (`/.well-known/farcaster.json`)

### Required Fields
- `accountAssociation`: { header, payload, signature } - domain verification via JFS
- `miniapp.version`: "1"
- `miniapp.name`: Max 32 chars
- `miniapp.homeUrl`: Launch URL, max 1024 chars
- `miniapp.iconUrl`: 1024x1024px PNG, no alpha

### Optional Fields
- `splashImageUrl`: 200x200px
- `splashBackgroundColor`: hex color
- `webhookUrl`: required for notifications
- `subtitle`: max 30 chars
- `description`: max 170 chars
- `screenshotUrls`: up to 3 portraits (1284x2778px)
- `primaryCategory`: one of (games, social, finance, utility, productivity...)
- `tags`: up to 5, max 20 chars each, lowercase
- `heroImageUrl`: 1200x630px (1.91:1)
- `requiredChains`: CAIP-2 IDs (e.g. "eip155:8453" for Base)
- `requiredCapabilities`: SDK method paths

## Embed Metadata (in index.html `<head>`)
```html
<meta name="fc:miniapp" content='{"version":"1","imageUrl":"...","button":{"title":"...","action":{"type":"launch_frame","url":"...","name":"..."}}}' />
```

## SDK
- Package: `@farcaster/miniapp-sdk`
- Init: `sdk.actions.ready()` in useEffect
- Wallet: `sdk.wallet.getEthereumProvider()` (EIP-1193)
- Key actions: ready(), close(), composeCast(), signin(), openUrl(), swapToken(), sendToken()

## Viewport
- Mobile: device dimensions
- Web: 424x695px target
- Rendered in vertical modal

## Wallet Connector
- Use `miniapp-wagmi-connector` or `sdk.wallet.getEthereumProvider()`
- NOT regular wagmi browser connector

## Deployment
1. Build + deploy site
2. Serve `/.well-known/farcaster.json`
3. Generate accountAssociation via Base Build tool
4. Validate with Base Build Preview
5. Publish by posting URL in Base app

## Key Docs
- https://miniapps.farcaster.xyz/docs/specification
- https://docs.base.org/mini-apps/quickstart/migrate-existing-apps
