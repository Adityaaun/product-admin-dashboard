# Nexgensis Product Admin Dashboard

## 1. Project Overview
This project is a Product Admin Dashboard built for the Nexgensis React Developer assignment. It provides a comprehensive interface to view, search, filter, and manage products using the DummyJSON API. The application is built entirely with Next.js, React, Tailwind CSS, and Axios.

## 2. Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Axios
- Native React Context (for local mutation state management)

## 3. Implemented Features
- Authentication
- Protected product routes
- Logout
- Product listing
- Responsive desktop table/mobile cards
- Pagination
- Page sizes 10/20/50
- URL-based page/search/filter/sort state
- Debounced search
- Search race-condition protection
- Category filtering
- Sorting
- Product details
- Reviews
- Add product
- Edit product
- Delete product
- Validation
- Delete confirmation
- Loading/empty/error/retry states

## 4. Architecture
- **UI/components**: Separated into reusable, focused components (e.g., `ProductForm`, `ConfirmModal`, `Pagination`, `SearchBar`) to keep code modular and readable.
- **API service layer**: All external API calls to DummyJSON are abstracted into `src/api/` (e.g., `products.ts`, `categories.ts`, `auth.ts`).
- **Shared Axios instance**: Located at `src/lib/axios.ts`, standardizing base URLs, headers, token injection, and global 401 interception.
- **Authentication utility**: Simple functions in `src/lib/auth.ts` to manage session tokens safely within the context of the assignment.
- **Product mutation context**: A native React Context (`ProductMutationsContext`) tracking additions, edits, and deletions in-memory to simulate CRUD persistence.
- **Product fetching hook**: A custom `useProductsFetch` hook that orchestrates pagination, searching, sorting, and race-condition cancellation logic.

## 5. Authentication
The application requires login credentials (`emilys` / `emilyspass`) via a POST request to `/auth/login`. On success, the API returns a JWT token. For this frontend assignment, the token is stored in `localStorage`. A central Axios interceptor automatically attaches this token as an `Authorization` header to every outgoing request and intercepts `401 Unauthorized` responses to securely clear the session and force a redirect to the login page.

## 6. Product Listing & URL State
The product dashboard relies entirely on the URL to manage application state. Query parameters such as `?page=1&limit=20&q=phone&category=smartphones&sortBy=price&order=asc` guarantee that copying and pasting links across browser tabs perfectly restores the user's exact view. Changing page sizes, sorting, or typing in the search bar strictly resets the pagination back to page 1 to prevent invalid data bounds.

## 7. Search & Race-Condition Handling
To ensure old search results never overwrite newer ones when a user types rapidly (or over a slow network):
- Keystrokes are throttled using a 500ms `useDebounce` hook.
- Once the debounced value changes, the URL `q` parameter is updated and the page resets to 1.
- The `useProductsFetch` hook reacts to the URL change, instantly triggering an `AbortController.abort()` to cancel the pending Axios request.
- A new request is launched alongside a strictly incremented `requestId`.
- When requests finally resolve, they are structurally forbidden from modifying React state unless their `requestId` perfectly matches the most recent active ID.

## 8. Category/Search Behavior
Because DummyJSON does not natively support combining product search queries (`/products/search?q=`) and category filtering (`/products/category/`), the application enforces a deliberate limitation strategy: when a user initiates a search, any active Category filter is securely stripped from the URL, and the UI dropdown becomes disabled. Conversely, manually selecting a category will clear the active search query. This prevents issuing fake parallel API requests or faking complex intersections locally.

## 9. CRUD & DummyJSON Persistence
DummyJSON mutation endpoints (`POST /add`, `PUT`, `DELETE`) successfully return simulated response models but do not provide permanent persistence in their remote database. To satisfy the assignment's requirement to reflect changes in the current application session:
- A local React Context overlay (`ProductMutationsContext`) is utilized.
- It tracks added products, edited products, and deleted product IDs.
- When `useProductsFetch` receives a fresh payload from DummyJSON, it natively filters out deleted IDs, merges updated values over existing objects, and prepends locally created products natively onto the UI without modifying the actual backend.

## 10. Validation & Duplicate Request Protection
- **Validation**: Forms require strict validation before submission. Titles and Descriptions cannot be purely whitespace (`.trim()`). Prices and Stocks must be numbers `>= 0`, with Stock strictly checked as an Integer. Fields outline in red with specific error text.
- **Duplicate Protection**: `isSubmitting` and `isDeleting` boolean gates prevent rapid clicking from spawning parallel `POST` or `DELETE` network requests.

## 11. Error & Edge-Case Handling
- **Invalid page values**: Manually manipulating the URL (e.g. `?page=abc`, `?page=-10`, `?limit=999`) triggers safe parsing that defaults parameters back to safe bounds (`page=1`, `limit=10`).
- **Page beyond available range**: Calculating ranges beyond the total dataset resolves to a graceful Empty State UI.
- **Invalid product IDs**: Viewing an invalid or deleted ID catches a 404 Axios error, rendering a dedicated "Product Not Found" fallback UI instead of crashing.
- **API errors**: Network failures render a red error banner paired with a `Retry` button to securely re-trigger the failed network payload.
- **Loading states**: Standardized CSS spinners display globally whenever API hooks are resolving.

## 12. Technical Decisions / Constraints
Following the strict constraints of the assignment:
- **Axios** is used exclusively for API interactions.
- One **shared Axios instance** tracks interceptors across all requests.
- **No React Query / SWR** was used; fetching is done natively.
- **No ready-made table or pagination libraries** were used.
- All pagination bounds, search throttle tracking, and URL parameter logic were built entirely manually from scratch.

## 13. Problem & Solution
**Problem:** Rapid typing combined with variable network latency causes earlier, slower search requests to overwrite the results of later, faster search requests, resulting in a fractured UI.
**Solution:** Implementing native `AbortController` injection inside the Axios service layer, combined with a `requestId` integer lock. Slower requests are either actively terminated by the browser or algorithmically blocked from calling `setState()` upon completion, guaranteeing absolute UI coherence.

## 14. AI Assistance
AI tools were used during the development of this project for rapid prototyping and architecture assistance. All implementations, technical trade-offs, architectures, and edge-cases have been fully reviewed, tested, and understood by the candidate to guarantee compliance with the assignment parameters.

## 15. Setup

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

## 16. Environment Variable
- `NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com`: Defines the root path for all Axios requests.

## 17. Verification
The final codebase has been rigorously tested and verified:
- **ESLint:** 0 errors, 0 warnings
- **TypeScript:** PASS
- **Production build:** PASS

## 18. Deployment
[Deployment URL Placeholder - Insert Vercel/Netlify Link Here]
