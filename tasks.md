## Tasks to complete

# Backend Tasks

- [x] add email send logic for register page
- [x] add seat booking page api's or controllers
- [x] controller/server actions for adding new food items
- [x] controller/server actions for adding new devices
- [x] controller/server actions for adding new time slots
- [x] MOST IMPORTENT - Set admin account type in supabase getclaims, see the latest note
- [x] function for deleting, updating and getting timeslots
- [x] function booking history, current bookings etc
- [x] cloudinary image upload system for fooditems
- [x] find api for seeing games
- [x] schema for available games
- [x] controller for adding available games and linking them to devices
- [x] Make a sytem for linking games with devices
- [x] Add point system for each user and make a server action for adding/redeeming points.
- [x] see rewardActions and complete it
- [x] Complete login and register page with supabase claims
- [x] add safeparse in all controllers
- [x] Check Seat hold controller for mistakes
- [ ] add pagination where needed
- [x] make controller for unlinking/updating linked games
- [x] controller for booking the holded seat
- [x] Optimize the bookSeat() controller - remove some code from transection to make it light
- [x] verifypayment controller
- [x] integrate retry payment or retry pending booking inside bookSeat()
- [x] webhook for razropay
- [x] controller for checking if user has any pending booking on first load
- [x] controller for checking booking details using bookingId and user to show on review screen if not provided in frontend or page refreshed
- [x] controller for getting deviceGames
- [x] make controller for getting all available games without devices
- [x] fix eslint issues
- [x] Controller file for fetching reward Points

## Importent on 09/11/2026

- [x] check the many to many reletions new code for console and gaames linking
- [x] Run generate and migrate command for current changes before any new changes

# Frontend Tasks

- [x] complete the game card ui and logic
- [x] check if theme change button is still in dropdown
- [x] complete second stage of homepage - Add filtergrid in homepage and detail card
- [x] complete the hooksection in homepage
- [ ] add gamecard into grid in add games card
- [x] make device card
- [x] Make foodItems card with image, name, description etc - see the fooditems table in schema file in src/db for more details.
- [x] Make Game Card for showing game catalogue see schema file for more detail.
- [x] Make homepage UI.
- [x] Add a theme changing button
- [x] Make a minimal navbar.
- [ ] Make the rewards page.
- [x] Add goodlooking react icons in all pages.
- [ ] add cloudinary signature generate in frontend
- [ ] add cloudinary image upload then food item upload in fooditems page of frontend
- [x] fix layout issue in register page
- [ ] Make Footer

## Run this checklist after deployement

- [ ] Run sql code for triggers and hooks in supabase dashboard
- [ ] Update otp verification email template - privacy policy link and ctrl cafe logo

#### Version 2 update features

- [ ] Subscription plans

#### Version 3 update features

- [ ] Smart Platform filter for adding games (admin)
- [ ] Book By selecting your fevorite game feature
