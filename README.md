# Delivery Challan Tracking & Merge System

A Google Forms + Google Sheets + Apps Script solution that lets multiple people log delivery challans from a shared form — without giving everyone direct edit access to the underlying data — while automatically merging updates into the correct existing record.

## Problem

A small business needed a simple way to track delivery challans (Challan No, who created it, date, company, challan upload, remarks, receiving upload, transaction type, payment status) created by **multiple people**, while:

- Keeping the raw data private — not everyone should have direct edit access to the shared sheet.
- Allowing anyone to **update** an existing challan (e.g., add the receiving copy, note an issue during delivery, correct a detail) *after* it was first created, without needing sheet access.
- Avoiding duplicate or conflicting rows when multiple people touched the same challan at different times.

## Solution

Instead of giving edit access to the sheet, updates are submitted the same way the original entry was created — **through the form**:

1. Anyone creates a challan by filling out the Google Form (Challan No acts as the primary key).
2. Submissions are collected into a Google Sheet via the linked Form Responses.
3. To update an existing challan (e.g., add the receiving upload, flag a delivery issue, correct a field), the person submits the **same form again** with the same Challan No and only the fields that changed.
4. This creates a *second* row for that Challan No in the sheet.
5. An Apps Script trigger (`onFormSubmit`) automatically:
   - Detects that a row with the same Challan No already exists.
   - Merges the new submission into the original row — overwriting fields that were updated, and skipping any field left blank (which signals "no change" rather than "clear this field").
   - Logs any remarks changes into a separate **Remarks History** sheet, so a full audit trail of updates is preserved.
   - Deletes the duplicate submission row, keeping the sheet clean with one row per challan.

This keeps the source data private to the people who manage the sheet, while still letting anyone contribute updates through the form — and prevents accidental overwrites or lost history when multiple people update the same challan over time.

## How It Works (Flow)

```
Form Submission
      │
      ▼
Form Responses Sheet (new row added)
      │
      ▼
onFormSubmit trigger fires
      │
      ├─ Challan No already exists?
      │     │
      │     ├─ No  → Treat as new challan, stamp date, keep row
      │     │
      │     └─ Yes → Merge into existing row:
      │              • Update changed fields only (skip blanks)
      │              • Log remarks changes to Remarks History
      │              • Delete the duplicate submission row
      ▼
Clean, single-row-per-challan dataset + full remarks audit trail
```

## Tech Stack

- **Google Forms** — data entry interface for all users
- **Google Sheets** — data storage
- **Google Apps Script (JavaScript)** — trigger-based merge and history logic

## Key Script Logic (`Code.gs`)

- Triggered `onFormSubmit`.
- Reads the newly submitted row and compares the Challan No against existing rows.
- If a match is found: selectively updates only the fields that changed (booklet reference, remarks, receiving upload), timestamps the update, appends any remarks change to a history log, and removes the now-redundant duplicate row.
- If no match is found: treats it as a new challan and timestamps it.

## Impact

- Removed the need to give direct sheet-edit access to every employee, while still letting anyone log or update a challan.
- Maintained a single, clean, de-duplicated record per challan instead of scattered/conflicting entries.
- Preserved a full history of remarks/updates for accountability, instead of overwriting past notes silently.

## Notes

This was built to solve a real operational problem for a small business's delivery tracking process. Sample data shown in any screenshots is illustrative/dummy data only — no real business or customer information is included in this repository.

## License

MIT
