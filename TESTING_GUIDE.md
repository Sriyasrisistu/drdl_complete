# Quick Testing Guide - New Features

## System Status
✅ **Backend:** Running on http://localhost:8080
✅ **Frontend:** Running on http://localhost:3000

---

## How to Test the New Features

### 1. Directorate Auto-Fill Feature

**Steps:**
1. Navigate to http://localhost:3000
2. Login with demo credentials:
   - Personnel No: `001234`
   - Password: `pass123`
3. **Expected Result:** The form loads and the "Directorate (Person Name)" field is automatically filled with your employee name

**Verification Points:**
- ✅ Field shows employee name from login session
- ✅ Field is disabled (cannot be edited)
- ✅ Field displays with "Auto-filled with your name" helper text below it
- ✅ Try clicking on the field - should not allow editing
- ✅ Fill out other form fields and submit - directorate value persists in database

---

### 2. Print Form Feature (Create Request Form)

**Steps:**
1. After logging in, scroll down to see the form buttons
2. Click the **🖨️ PRINT FORM** button
3. A new print dialog window should open

**Expected Behavior:**
- ✅ New browser window opens with print layout
- ✅ Content displayed in landscape orientation
- ✅ Shows form header: "SAFETY & FIRE COVERAGE REQUEST FORM"
- ✅ Shows organization name: "Defence Research and Development Laboratory"
- ✅ Displays personnel information:
  - Personnel Number
  - Safety Coverage Type
  - Directorate (Person Name)
  - Division
- ✅ Shows timestamp of when print was generated
- ✅ Proper margins and spacing for printing
- ✅ Browser print dialog appears
- ✅ You can print to PDF or physical printer

**Test Print-to-PDF:**
1. Click "🖨️ PRINT FORM" button
2. In the print dialog, select "Print to PDF" or "Save as PDF"
3. Choose save location
4. Verify PDF opens with proper formatting

---

### 3. Print Form Feature (Edit Request Form)

**Steps:**
1. Create a new safety request first:
   - Select a coverage type (e.g., INTEGRATION)
   - Fill in required fields
   - Click "SAVE" button
2. Scroll down to "My Safety Requests" table
3. Find your saved request and click the **✏️ Edit** button
4. The edit form loads - click the **🖨️ PRINT FORM** button

**Expected Behavior:**
- ✅ Print dialog opens with landscape orientation
- ✅ Shows request information including Request ID
- ✅ Shows date of request
- ✅ All current form data displays correctly
- ✅ Same professional formatting as create form

---

### 4. Edit Request Behavior (No Popups)

**Steps:**
1. Create a test request:
   - Select coverage type: INTEGRATION
   - Fill in required fields
   - Click "SAVE"
2. View the request in the table
3. Click "✏️ Edit" button on any request

**Expected Behavior:**
- ✅ No popup dialog appears
- ✅ Full form page loads with edit layout
- ✅ Form looks identical to create form
- ✅ Same fields and validations
- ✅ Coverage type selection works same way
- ✅ Can modify any editable field
- ✅ Can print from edit form
- ✅ Click "CANCEL" returns to home
- ✅ Click "UPDATE REQUEST" saves changes

**Form Validation in Edit:**
- ✅ Personnel Number is required
- ✅ Safety Coverage Type is required
- ✅ Directorate field is read-only and cannot be changed
- ✅ Coverage type determines which form section appears
- ✅ All field validations work same as create form

---

## Button Color Legend

| Button | Color | Action |
|--------|-------|--------|
| 🖨️ PRINT FORM | Blue (#3B82F6) | Opens print layout in new window |
| SAVE | Green outline | Saves request without submission |
| SEND TO HEAD, SFEED | Green filled | Submits request (with declaration) |
| UPDATE REQUEST | Green filled | Updates existing request |
| CANCEL | Green outline | Returns to home without saving |

---

## Demo Data

**Login Credentials:**
- Personnel No: `001234`
- Password: `pass123`

**Employee Details (Pre-loaded):**
- Name: Rajeev Kumar
- Designation: Senior Engineer
- Directorate: SFEED
- Division: Engineering

---

## Troubleshooting

### Print not opening
- Check if browser popup blocker is enabled
- Disable popup blocker for localhost:3000
- Try with a different browser

### Directorate field shows wrong name
- Logout and login again
- Clear browser cache and reload
- Check that backend is returning correct employee data

### Edit form not loading
- Verify request ID is valid
- Check backend logs for errors
- Refresh the page and try again

### Print dialog shows incorrect data
- Ensure all form fields are filled before printing
- Check if you're on the correct form (create vs edit)
- Reload the page if data seems stale

---

## Feature Completeness Checklist

- ✅ Directorate auto-fills with logged-in user name
- ✅ Directorate field is read-only and cannot be edited
- ✅ Print button is visible in create form
- ✅ Print button is visible in edit form
- ✅ Print works with landscape orientation
- ✅ Print shows proper formatting and margins
- ✅ Print shows only current form data
- ✅ No test type selection needed for printing
- ✅ Edit form looks like create form
- ✅ Edit form uses same validations
- ✅ No popup dialogs appear
- ✅ Clean navigation flow: view → edit → save → print
- ✅ Button layout is consistent across both forms
- ✅ Print button opens in new window
- ✅ Browser print dialog works correctly

---

## Next Steps (Optional Enhancements)

1. **Add Digital Watermark** - "DRAFT" or "SUBMITTED" on print
2. **Save Print as PDF** - Direct PDF download from form
3. **Print History** - Track all prints for a request
4. **Email PDF** - Send print directly to email
5. **Print Preview** - Show preview before actual print
6. **Batch Print** - Print multiple requests at once
7. **Print Templates** - Custom print layouts per coverage type

---

**Last Updated:** January 20, 2026
**Status:** All features implemented and tested ✅
