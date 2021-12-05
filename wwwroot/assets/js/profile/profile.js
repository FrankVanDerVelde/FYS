document.addEventListener("DOMContentLoaded", async function () {
    const dummyUser1 = {
        "name": "John Doe",
        "birthdate": "1990-11-28",
        "location": "Amsterdam",
        "email": "johndoe@mail.com",
        "phoneNumber": "061234568",
        "profilePic": "../img/placeholder-images/profile-picture.png",
        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus egestas sapien sed varius. Nam euismod efficitur sapien nec condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut luctus suscipit volutpat. Duis accumsan viverra tellus vitae posuere. Curabitur commodo arcu vel massa ultricies, non tempus augue dapibus. Praesent sem ex, accumsan eget rhoncus vel, consequat nec lectus. Cras eu massa fermentum erat tincidunt dignissim et nec lacus.",
    }

    const userOneDummyInterests = [{
            "name": "Sports",
            "thumb": "place-holder.png"
        },

        {
            "name": "Nature",
            "thumb": "place-holder.png"
        },

        {
            "name": "Drinking",
            "thumb": "place-holder.png"
        },

        {
            "name": "Swimming",
            "thumb": "place-holder.png"
        },

        {
            "name": "Beach",
            "thumb": "place-holder.png"
        },

        {
            "name": "Eating",
            "thumb": "place-holder.png"
        },

        {
            "name": "Sight seeing",
            "thumb": "place-holder.png"
        },

        {
            "name": "Shopping",
            "thumb": "place-holder.png"
        }
    ];

    try {
        const userData = await FYSCloud.API.queryDatabase("SELECT * FROM fys_is109_4_harmohat_chattest.account WHERE id = 1;")

    } catch (e) {
        console.error(e);
    }

//     for (const [key, value] of mySearchParams.entries()) {
// }

    const profilePictureElement = document.getElementById("profile-picture");
    const nameElement = document.getElementById("name");
    const ageElement = document.getElementById("age");
    const locationElement = document.getElementById("location");
    const emailElement = document.getElementById("email");
    const bioElement = document.getElementById("bio");
    
    const {name, birthdate, location, email, profilePic, bio} = dummyUser1;

    profilePictureElement.src = profilePic;
    nameElement.innerHTML = name;
    ageElement.innerHTML = (new Date).getFullYear() - new Date(birthdate).getFullYear();
    locationElement.innerHTML = location;
    profilePictureElement.innerHTML = profilePic;
    emailElement.innerHTML = email;
    bioElement.innerHTML = bio;

    const interestsContainer = document.getElementById("interests-container");

    userOneDummyInterests.forEach(interest => {
        const {name, thumb} = interest;

        const interestDiv = document.createElement("div");
        interestDiv.className = "interest-element";

        const interestThumb = document.createElement("img");
        interestThumb.src = "../img/placeholder-images/" + thumb;
        interestThumb.alt = name;

        const interestSpan = document.createElement("span");
        const interestSpanText = document.createTextNode(name);
        interestSpan.append(interestSpanText);
        

        interestDiv.append(interestThumb);
        interestDiv.append(interestSpan);

        interestsContainer.append(interestDiv);
    
    })

});