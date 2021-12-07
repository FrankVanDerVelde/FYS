document.addEventListener("DOMContentLoaded", async function () {
    // Get user id from session here
    const userId = 47;
    
    // The id used to get the profile data
    let contentId;

    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    const matchInfoBar = document.getElementById("match-info-bar");

    // If someone else's profile add match button
    if (userId == profileId || !profileId) {
        contentId = userId;
    } else {
        contentId = profileId;

        let matchIconClass;
        let matchBarText;

        // SQL query to check if user is a match here
        if (true) {
            matchIconClass = "minus";
            matchBarText = "Verwijder als match";
        } else {
            matchIconClass = "plus";
            matchBarText = "Verstuur match verzoek";
        }

        // Create span to hold the icon
        const matchIconSpan = document.createElement("span");
        matchIconSpan.className = "icon send-message";

        // Create i element with the font awesome icon class
        const matchIconI = document.createElement("i");
        matchIconI.className = `fas fa-user-${matchIconClass}`;

        // Add i to span
        matchIconSpan.append(matchIconI);

        // Add icon span to div
        matchInfoBar.append(matchIconSpan);

        

        // Create span to hold the description text
        const matchTextSpan = document.createElement("span");

        // Add text to text element
        const matchText = document.createTextNode(matchBarText);
        matchTextSpan.append(matchText);

        // Add text span to div
        matchInfoBar.append(matchTextSpan);
    }

    let profileData;
    let userInterests = await getUserInterests(contentId);
    try {
        profileData = await FYSCloud.API.queryDatabase(`SELECT * FROM fys_is109_4_harmohat_chattest.account WHERE id =${contentId};`);

        // Get the details of the interests the user has
        userInterests = await FYSCloud.API.queryDatabase(`SELECT description, imageLink FROM fys_is109_4_harmohat_chattest.interestdetail WHERE description in ('${userInterests.join("', '")}');`);
    } catch (e) {
        console.error(e);
    }

    const {name, birthdate, location, email, profilePhoto, bio, phonenumber} = profileData[0];

    // Call person on click
    document.getElementById("phonenumber-info-bar").addEventListener('click', ()=> window.open("tel:0633080830", '_self'));

    // Mail person on click
    document.getElementById("email-info-bar").addEventListener('click', ()=> window.open(`mailto:${email}?subject=Corendon%20Match`, '_self'));
    
    const profilePictureElement = document.getElementById("profile-picture");
    const nameElement = document.getElementById("name");
    const ageElement = document.getElementById("age");
    const locationElement = document.getElementById("location");
    const emailElement = document.getElementById("email");
    const bioElement = document.getElementById("bio");
    const phoneNumber = document.getElementById("phone-number");

    profilePictureElement.src = profilePhoto;
    nameElement.innerHTML = name;
    ageElement.innerHTML = (new Date).getFullYear() - new Date(birthdate).getFullYear();
    locationElement.innerHTML = location;
    profilePictureElement.innerHTML = profilePhoto;
    emailElement.innerHTML = email;
    bioElement.innerHTML = bio;
    phoneNumber.innerHTML = phonenumber;

    const interestsContainer = document.getElementById("interests-container");

    userInterests.forEach(interest => {
        const {description: name, imageLink} = interest;

        const interestDiv = document.createElement("div");
        interestDiv.className = "interest-element";

        const interestThumb = document.createElement("img");
        // interestThumb.src = "../img/placeholder-images/" + imageLink;
        interestThumb.src = "../img/placeholder-images/place-holder.png";
        interestThumb.alt = name;

        const interestSpan = document.createElement("span");
        const interestSpanText = document.createTextNode(name);
        interestSpan.append(interestSpanText);
        

        interestDiv.append(interestThumb);
        interestDiv.append(interestSpan);

        interestsContainer.append(interestDiv);
    
    })

});