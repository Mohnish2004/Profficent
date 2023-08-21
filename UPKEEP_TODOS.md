# Upkeep

This file is meant to be a quick brief on the status of the code and what needs to be looked over or rewritten.  
Good luck, upkeep team! Remove items from the list once they're considered complete and remove this file entirely once
it is no longer needed!

# Code Status
Code quality on the backend is all good with the following minor exceptions:
* API URL paths may require renaming (Example: `/user/getbyuser` can be `/users/id` or similar)
* Some misspellings in MongoDB Schemas like `accomodations` instead of `accommodations`.

Code quality on the front end varies by file. Some may still be messy while others have already been reviewed.  
CSS has not been reviewed. There may be some messy numbers like 548px in CSS and some iffy naming conventions in use.  
Easily resolved problems have mostly been fixed. Some reorganization may still be necessary.  
Site does not function well at all on smaller screens.

# TODOs

* Review unused components. Take out what is useful and delete the rest
    * `src/components/old` contains components that are *NOT USED AT ALL* and not likely to be
    * Other unused files in other locations to look over include:
        - `src/components/organisms/PopUpModal.js`
        - `src/components/organisms/CustomProgressBar.js`
* Finish splitting Profile.js
    * Partially done but did not have time to finish cleaning up `src/components/organisms/profile/ProfileEdit.js`
        * There are still three CSS file imports... It's better than before though
        * Fix functions in Profile.js... They don't work as intended and seem to have never been designed to work
        * Reduce number of unnecessary useState calls (Partially done)
            * Some values can be derived from other values stored in state and recalculated instead of stored. Can also
              be the job of utility functions
* General: Split more components into smaller, reusable parts
    * Replace placeholder rectangles on homepage with actual images
* Stylistic (Definitely optional)
    * Capitalization of certain things like "-- select --"
    * Take care of accessibility warnings (Minor)
        * Make certain items tabbable and keyboard navigable
        * Reword garbage alt text into something actually intelligible (blurImg => Blurred Profile Page Image)