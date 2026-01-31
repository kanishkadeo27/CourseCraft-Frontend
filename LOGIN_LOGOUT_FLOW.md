# Login/Logout Flow - Complete Implementation Guide

## 🎯 Overview
This document describes the complete login/logout flow with navbar switching functionality.

## 📋 Flow Diagram

### Login Flow
```
1. User visits /login page (sees GuestNavbar with Login/Signup buttons)
2. User enters email and password
3. Click "LOGIN" button
4. Frontend validates input
5. AuthContext.login() called
6. API call to /api/auth/login
7. Backend returns token + user data
8. Token and user data saved to localStorage
9. AuthContext state updated (setUser)
10. DynamicLayout detects user state change
11. Switches from GuestLayout → UserLayout/AdminLayout
12. UserNavbar/AdminNavbar displayed with Logout button
13. User redirected to home or intended page
```

### Logout Flow
```
1. User clicks "Logout" button in UserNavbar/AdminNavbar
2. handleLogout() called
3. Mobile menu closed (if open)
4. AuthContext.logout() called
5. Backend logout endpoint called (optional)
6. localStorage cleared (token, user, courseProgress)
7. AuthContext state updated (setUser = null)
8. DynamicLayout detects user state change
9. Switches from UserLayout/AdminLayout → GuestLayout
10. GuestNavbar displayed with Login/Signup buttons
11. User redirected to home page
```

## 🔧 Implementation Details

### AuthContext Changes
- **logout()**: Now properly clears all localStorage and triggers state update
- **login()**: Saves token and user data, triggers navbar switch
- **isAuthenticated()**: Checks both user state and token in localStorage

### Navbar Components
- **GuestNavbar**: Shows Login and Signup buttons (when user = null)
- **UserNavbar**: Shows Logout button (when user.role = "user")
- **AdminNavbar**: Shows Logout button (when user.role = "admin")

### DynamicLayout
- Checks user state from AuthContext
- Renders appropriate layout based on user role
- Automatically switches when user state changes

## ✅ Testing Checklist

### Login Flow
- [ ] Navigate to /login page
- [ ] Verify GuestNavbar is displayed with Login/Signup buttons
- [ ] Enter valid credentials
- [ ] Click LOGIN button
- [ ] Verify loading state shows
- [ ] After successful login, verify:
  - [ ] Navbar switches to UserNavbar/AdminNavbar
  - [ ] Logout button appears
  - [ ] Login/Signup buttons disappear
  - [ ] User is redirected to home or intended page
  - [ ] Token is saved in localStorage
  - [ ] User data is saved in localStorage

### Logout Flow
- [ ] Click Logout button in navbar
- [ ] Verify loading state shows
- [ ] After logout, verify:
  - [ ] Navbar switches back to GuestNavbar
  - [ ] Login/Signup buttons reappear
  - [ ] Logout button disappears
  - [ ] User is redirected to home page
  - [ ] localStorage is cleared (token, user, courseProgress)
  - [ ] Mobile menu is closed (if open)

### Mobile Responsiveness
- [ ] On mobile, click hamburger menu
- [ ] Verify mobile menu opens
- [ ] Click Login/Signup links
- [ ] Verify menu closes
- [ ] After login, verify mobile menu shows Logout button
- [ ] Click Logout on mobile
- [ ] Verify menu closes and navbar switches

### Edge Cases
- [ ] Try logging in with invalid credentials
- [ ] Verify error message displays
- [ ] Try logging in with empty fields
- [ ] Verify validation error displays
- [ ] Refresh page after login
- [ ] Verify user stays logged in (token restored from localStorage)
- [ ] Refresh page after logout
- [ ] Verify user stays logged out

## 🔐 Security Features

### Token Management
- Token stored in localStorage
- Token expiration checked on app load
- Token expiration checked before API calls
- Expired tokens automatically cleared
- 401 responses trigger logout and redirect to login

### Logout Security
- All localStorage cleared on logout
- Backend logout endpoint called (if available)
- User state set to null
- Navbar switches immediately
- User redirected to home page

## 📱 Mobile Optimization

### Mobile Menu Behavior
- Menu closes on navigation
- Menu closes on logout
- Logout button properly styled on mobile
- Touch-friendly button sizes

## 🚀 Production Checklist

- [ ] Test login with valid credentials
- [ ] Test logout functionality
- [ ] Verify navbar switches correctly
- [ ] Verify localStorage is cleared on logout
- [ ] Test on mobile devices
- [ ] Test token expiration handling
- [ ] Test 401 error handling
- [ ] Test network error handling
- [ ] Verify error messages are user-friendly
- [ ] Test page refresh after login/logout
- [ ] Test browser back button after logout
- [ ] Test multiple browser tabs (logout in one, verify in others)

## 🐛 Troubleshooting

### Issue: Navbar doesn't switch after login
**Solution**: 
- Check that AuthContext.login() properly calls setUser()
- Verify DynamicLayout is checking user state
- Check browser console for errors

### Issue: Logout doesn't clear localStorage
**Solution**:
- Verify AuthContext.logout() is removing all keys
- Check that setUser(null) is called
- Verify no other code is re-adding data to localStorage

### Issue: User stays logged in after logout
**Solution**:
- Check that localStorage is fully cleared
- Verify page is redirected to home
- Check browser cache/cookies

### Issue: Mobile menu doesn't close on logout
**Solution**:
- Verify setOpen(false) is called before logout
- Check that handleLogout() is properly structured

## 📊 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    App Component                             │
│                  (AuthProvider)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   AuthContext              │
        │  - user: null/object       │
        │  - loading: boolean        │
        │  - login()                 │
        │  - logout()                │
        └────────────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │   DynamicLayout            │
        │  - Checks user state       │
        │  - Renders appropriate     │
        │    layout                  │
        └────────────────┬───────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────┐          ┌──────────────────┐
│  GuestLayout     │          │  UserLayout      │
│  - GuestNavbar   │          │  - UserNavbar    │
│  - Login/Signup  │          │  - Logout button │
│    buttons       │          │                  │
└──────────────────┘          └──────────────────┘
```

## 🎉 Summary

The login/logout flow is now fully implemented with:
- ✅ Proper navbar switching based on authentication state
- ✅ Complete localStorage cleanup on logout
- ✅ Smooth user experience with loading states
- ✅ Mobile-responsive design
- ✅ Error handling and validation
- ✅ Token management and expiration checking
- ✅ Secure logout with backend integration