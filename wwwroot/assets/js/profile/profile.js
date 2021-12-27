document.addEventListener("DOMContentLoaded", async function () {
    // Get user id from session here
    const loggedin = FYSCloud.Session.get("loggedin")
    const userId = loggedin[0].id;

    // Get current profile id from url
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('profileid');

    // Hide change profile button if not own profile
    (profileId != userId && profileId) && (document.getElementById('edit-profile-button').style.display = 'none');

    // The id used to get the profile data
    let contentId;
    if (userId == profileId || !profileId) {
        contentId = userId;
    } else {
        contentId = profileId;

        let matchStatus;
        try {
            function toggleMatchButtons(newActiveElement) {
                // Remove active from currently active element
                document.querySelector('.match-bar.active').classList.toggle('active');

                // Add active to new element
                newActiveElement.classList.toggle('active');
            }
            matchStatus = await FYSCloud.API.queryDatabase(`SELECT status FROM matches WHERE currUserFK = ? AND matchedUserFk = ?`, [userId, profileId]);
        } catch (e) {
            console.error(e);
        }

        const matchBar = document.getElementById("match-info-bar-match");
        const unmatchBar = document.getElementById("match-info-bar-unmatch");
        const cancelBar = document.getElementById("match-info-bar-cancel");

        matchBar.addEventListener('click', async function () {
            try {
                await FYSCloud.API.queryDatabase(`INSERT INTO matches (currUserFK, matchedUserFk, status) VALUES (?, ?, ?)`, [userId, profileId, 'pending']);
                toggleMatchButtons(cancelBar)
            } catch (e) {
                console.error(e);
            }
        });

        unmatchBar.addEventListener('click', async function () {
            try {
                await FYSCloud.API.queryDatabase(`DELETE FROM matches WHERE currUserFK = ${userId} AND matchedUserFk = ${profileId}`);
                toggleMatchButtons(matchBar)
            } catch (e) {
                console.error(e);
            }
        });

        cancelBar.addEventListener('click', async function () {
            try {
                await FYSCloud.API.queryDatabase(`DELETE FROM matches WHERE currUserFK = ${userId} AND matchedUserFk = ${profileId}`);
                toggleMatchButtons(matchBar)
            } catch (e) {
                console.error(e);
            }
        });

        // Set currently active bar
        if (matchStatus.length == 0) {
            matchBar.classList.toggle('active');
        } else if (matchStatus[0].status === 'pending') {
            cancelBar.classList.toggle('active');
        } else if (matchStatus[0].status === 'accepted') {
            unmatchBar.classList.toggle('active');
        }
    }

    let profileData;
    let userInterests = await getUserInterests(contentId);
    try {
        // Get user data
        profileData = await FYSCloud.API.queryDatabase(`SELECT * FROM account WHERE id =${contentId};`);

        // Get the details of the interests the user has
        userInterests = await FYSCloud.API.queryDatabase(`SELECT description, imageLink FROM interestdetail WHERE description in ('${userInterests.join("', '")}');`);
    } catch (e) {
        console.error(e);
    }

    let genders;
    try {
        genders = await FYSCloud.API.queryDatabase(`SELECT * FROM gender`);
    } catch (e) {
        console.error(e);
    }

    const {
        name,
        birthdate,
        location,
        email,
        profilePhoto,
        bio,
        phonenumber,
        genderFk
    } = profileData[0];

    // Call person on click
    document.getElementById("phonenumber-info-bar").addEventListener('click', () => window.open("tel:0633080830", '_self'));

    // Mail person on click
    document.getElementById("email-info-bar").addEventListener('click', () => window.open(`mailto:${email}?subject=Corendon%20Match`, '_self'));

    const profilePictureElement = document.getElementById("profile-picture");
    const nameElement = document.getElementById("name");
    const ageElement = document.getElementById("age");
    const genderElement = document.getElementById("gender");
    const locationElement = document.getElementById("location");
    const emailElement = document.getElementById("email");
    const bioElement = document.getElementById("bio");
    const phoneNumber = document.getElementById("phone-number");

    profilePictureElement.src = profilePhoto;
    nameElement.innerHTML = name;
    ageElement.innerHTML = (new Date).getFullYear() - new Date(birthdate).getFullYear();
    genderElement.innerHTML = genders[genderFk].name;
    locationElement.innerHTML = location;
    emailElement.innerHTML = email;
    bioElement.innerText = bio;
    phoneNumber.innerHTML = phonenumber;
    profilePictureElement.src = (profilePhoto ? profilePhoto : `https://ui-avatars.com/api/?name=${name}?background=#e0dcdc`);

    const interestsContainer = document.getElementById("interests-container");

    userInterests.forEach(interest => {
        const {
            description: name,
            imageLink
        } = interest;

        const interestDiv = document.createElement("div");
        interestDiv.className = "interest-element";

        const interestThumb = document.createElement("img");
        interestThumb.src = (imageLink ? `../img/interests/${imageLink}` : "../img/placeholder-images/place-holder.png");
        interestThumb.alt = name;

        const interestSpan = document.createElement("span");
        const interestSpanText = document.createTextNode(name);
        interestSpan.append(interestSpanText);


        interestDiv.append(interestThumb);
        interestDiv.append(interestSpan);

        interestsContainer.append(interestDiv);

    })

});