## 🚧 Known Technical Debt

### Dynamic Tenant Name on Landing Page
**Status:** Blocked by React framework bug
**Issue:** "Expected a suspended thenable" error
**Workaround:** Generic welcome message instead of tenant-specific name
**Impact:** Low - does not affect core functionality
**Test affected:** `tenant-identification.spec.ts` (temporarily removed)
**Resolution plan:** Monitor React issue and restore once fixed
