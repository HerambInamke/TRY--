# AWS UG Pune Website: Consolidated Update List

## A. Open audit items (from the review table)

**High priority**
1. **Hero event date:** The hero still shows the 18 Oct 2026 event with a "JOIN HER TECH ERA" CTA. Switch to a recap or thank-you state, or announce the next date.
2. **Events ticker:** The May 16, 2026 GenAI & Multi-Agent event is still labelled UPCOMING. Move it to past/LATEST, or auto-label events by date.
3. **Meta tags (SEO and sharing):** The canonical and og:url tags point to the awsugpune.in homepage, and the title and description are the homepage's. Give this page its own title, description, OG image, and canonical URL.
4. **Mobile header and ticker:** The sticky header and events bar take about 20% of the screen and cover section headings on anchor jumps. Add scroll-margin-top to sections and collapse the ticker on scroll.
5. **Four ideas / phases:** The phases jump from 01 LEARN to 03 CONNECT, so 02 BUILD is missing or its animation isn't firing. Check that it renders on mobile.
6. **Marquee:** The "A Women in Technology Initiative by AWS User Group Pune" text is covered until the marquee is removed. (Item 14 has no owner or notes yet.)
7. **Marquee text replacement:** Replace "A Women in Technology Initiative by AWS User Group Pune" with "The Pune Chapter of AWS User Group Women in Tech India."
8. **Tagline replacement:** Replace "Empowering women in cloud, AI, DevOps, and architecture through mentorship, workshops, and community." with "Powered by AWS User Group Pune."
9. **"Join Her Tech Era" button:** Confirm where it should redirect. The current target is unclear.

**Medium priority**
10. **Client-rendered content:** Crawlers and link previews only see the shell. Pre-render or server-render the page.
11. **Ticker edges:** Text runs under the close (X) button, and the first letter is clipped by the EVENTS pill ("Kubernetes"). Add padding or a mask on both ends of the track.
12. **Scroll-to-top button:** It covers the copyright line, testimonial text, and section headings. Shrink it and add bottom padding to the footer.
13. **Loader remnants:** "100% Preparing your experience..." and a ghost "Welcome" are visible behind the hero. Fully unmount or hide the loader when it finishes.

**Low priority**
14. **Spacing:** Large empty gaps after "Growth-oriented" and between timeline cards on mobile. Reduce them.
15. **Community voices tags:** COMMUNITY and SOLUTIONS are truncated. Wrap or shorten them, and remove the duplicate Afreen entry.
16. **Community voices avatars:** Swaati and Janhavi use group photos. Replace them with individual headshots.
17. **Footer tip:** It mentions a notification bell that doesn't appear in the mobile header. Show the bell on mobile or change the tip text.

**Blocked**
18. **Gallery folders:** Split the gallery into a separate folder per event, with each folder holding only that event's photos. Status: waiting for the Drive link from the team.

## B. Items done but not yet validated

These are marked Done in the tracker, but the team hasn't validated them yet:
- Her Tech Era gallery section, using the photos from the OneDrive link (delivered 17-May)
- Two-button community join flow: one shared form with a dropdown for Volunteer or Speaker, collecting name, email, phone, and other needed fields, with responses shared with Afreen's team or copied by email (delivered 17-May)
- Next-event notification marquee for both AWS UG and Her Tech Era: shows the next event date, links to the registration page, is editable, and is visually highlighted (delivered 17-May)
- Fixed hyperlink redirects for About, FAQ, Team, and Join after opening Her Tech Era (delivered 17-May)

## C. Completed and validated

- Increased the AWS User Group Pune logo size (validated)
- Replaced "Women in Tech" with "Her Tech Era," with a button on the home page linking to the Her Tech Era main page (validated)
- Added the Meetup link (validated)
- Added the LinkedIn link (validated)

## D. Open tracker items with no details yet

- Fix the logo background and style. "As discussed" is noted, but the target is not specified. Needs clarification.
- The Social Buttons row has no description.
- The last row of the audit table (#19) is empty.