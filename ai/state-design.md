# State Design: Swarm Protocol (Base Miniapp)

## Target: Base Miniapp (424x695px vertical modal)

---

## 1. Navigation Architecture

**Current**: 6 pages via react-router (Marketplace, Post Task, My Tasks, Disputes, Juror Pool, Task Detail)

**Miniapp**: Tab-based single-page with panels. No URL routing in a miniapp iframe.

```
┌─────────────────────┐
│  Header (compact)    │  Fixed: logo + wallet status + stats
├─────────────────────┤
│                     │
│  Active Panel       │  Swappable content area
│  (scrollable)       │
│                     │
│                     │
├─────────────────────┤
│  Tab Bar (fixed)    │  4 tabs max (thumb-friendly)
└─────────────────────┘
```

**Tabs (4)**:
1. **Feed** - All open tasks (marketplace)
2. **Post** - Create task form
3. **Mine** - My created + claimed tasks
4. **Jury** - Disputes + juror pool (combined)

Task detail = slide-up sheet over current tab (not a separate route).

---

## 2. Wallet & Auth State

**Current**: RainbowKit + wagmi browser connector

**Miniapp**: Farcaster SDK wallet provider

```typescript
// State machine
type WalletState =
  | { status: 'disconnected' }
  | { status: 'connecting' }
  | { status: 'connected'; address: `0x${string}`; fid: number }
  | { status: 'error'; message: string }
```

**Key change**: Replace RainbowKit entirely. Use `@farcaster/miniapp-sdk` for:
- `sdk.wallet.getEthereumProvider()` → EIP-1193 provider for wagmi
- `sdk.context` → get user FID, profile data
- `sdk.actions.ready()` → hide splash screen on load

**wagmi config change**:
```typescript
// OLD: getDefaultConfig with RainbowKit
// NEW: custom wagmi config with Farcaster provider
import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'  // mainnet, not sepolia

const farcasterProvider = sdk.wallet.getEthereumProvider()

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  connectors: [/* miniapp-wagmi-connector */]
})
```

**Chain change**: Base Sepolia → **Base Mainnet** (miniapps are production)

---

## 3. Core Data State

### Tasks
```typescript
interface TaskStore {
  // Server state (from contract reads)
  tasks: Map<bigint, Task>
  taskCount: bigint

  // Derived views (computed, not stored)
  openTasks: Task[]        // Feed tab: status === Open
  myCreated: Task[]        // Mine tab: creator === me
  myClaimed: Task[]        // Mine tab: assignee === me

  // UI state
  selectedTaskId: bigint | null  // detail sheet
  filter: TaskFilter
  isLoading: boolean
}

type TaskFilter = 'all' | 'high-value' | 'expiring-soon' | 'low-bond'
```

### Disputes & Jury
```typescript
interface DisputeStore {
  disputes: Map<bigint, Dispute>
  jurorCount: bigint
  isJuror: boolean           // am I registered?
  myActiveDisputes: Dispute[] // disputes where I'm a juror
}
```

### USDC Approval
```typescript
interface UsdcState {
  balance: bigint
  allowance: bigint
  needsApproval: boolean  // allowance < required amount
}
```

---

## 4. Transaction State

Miniapp transactions need explicit pending state (no MetaMask popup, Farcaster handles signing).

```typescript
type TxState =
  | { phase: 'idle' }
  | { phase: 'approving-usdc'; amount: bigint }
  | { phase: 'confirming'; action: string; hash?: `0x${string}` }
  | { phase: 'success'; hash: `0x${string}` }
  | { phase: 'error'; message: string }

// Single global tx state - only one tx at a time in mobile context
```

---

## 5. Miniapp SDK State

```typescript
interface MiniappState {
  isReady: boolean        // sdk.actions.ready() called
  context: {
    fid: number
    username: string
    pfpUrl: string
    custody: `0x${string}`
  } | null
  isInMiniapp: boolean    // detect if running in Farcaster or standalone
}
```

---

## 6. State Management Approach

**Keep it simple**: React Context + useReducer. No Redux/Zustand for 4 tabs.

```
MiniappProvider        → SDK init, context, wallet
  └─ WagmiProvider     → chain config, contract reads
      └─ SwarmProvider → task/dispute state, actions
          └─ App       → tabs, panels, sheets
```

**Data fetching**: Keep existing wagmi `useReadContract` hooks but wrap them in a single `useSwarmData()` hook that returns everything the UI needs.

---

## 7. Key State Transitions

### Create Task Flow (miniapp)
```
[Post tab] → fill form → approve USDC (if needed) → create tx → success toast → auto-switch to Feed
```

### Claim Task Flow
```
[Feed tab] → tap task → detail sheet slides up → claim button → approve bond → tx → sheet updates status
```

### Dispute Flow
```
[Mine tab] → tap submitted task → detail sheet → dispute button → tx → jury tab shows active dispute
```

---

## 8. What Changes vs Current

| Aspect | Current (Desktop) | Miniapp |
|--------|-------------------|---------|
| Navigation | react-router, 6 pages | 4 tabs + slide-up sheets |
| Wallet | RainbowKit | Farcaster SDK provider |
| Chain | Base Sepolia | Base Mainnet |
| Layout | 1280px max-width | 424px fixed |
| Task detail | Separate page | Bottom sheet overlay |
| Footer | Full nav + links | None (tab bar replaces) |
| Header | Full masthead | Compact: logo + connect |

---

## 9. Files to Change

### Remove
- `config/wagmi.ts` → replace with miniapp wagmi config
- RainbowKit dependency entirely

### Add
- `@farcaster/miniapp-sdk`
- `miniapp-wagmi-connector` (or custom connector)
- `providers/MiniappProvider.tsx`
- `components/common/BottomSheet.tsx`
- `components/common/TabBar.tsx`

### Modify
- `main.tsx` → swap RainbowKit for Farcaster provider
- `App.tsx` → replace router with tab-based nav
- All hooks → update for Base Mainnet chain ID
- `lib/constants.ts` → new contract address on mainnet (or keep sepolia for now)

---

## 10. Open Questions

1. **Mainnet deploy**: Do we deploy contract to Base mainnet or keep sepolia for now?
   - Recommendation: Keep Sepolia for dev, but the miniapp config should target mainnet
   - Can use a toggle: `IS_TESTNET` flag

2. **Standalone mode**: Should the app also work outside Farcaster (regular browser)?
   - Recommendation: Yes, with fallback to RainbowKit when not in miniapp context
   - Detect via `sdk.context` availability

3. **Notifications**: Use Farcaster notifications for task updates?
   - Would need webhookUrl in manifest
   - Nice-to-have, not MVP
