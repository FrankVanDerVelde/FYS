document.addEventListener("DOMContentLoaded", async function () {
    const dummyUser1 = {
        "name": "John Doe",
        "age": "35",
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

    const nameInput = document.getElementById("name-input");
    const ageInput = document.getElementById("age-input");
    const locationInput = document.getElementById("location-input");
    const phoneNumberInput = document.getElementById("phone-number-input");
    const emailInput = document.getElementById("email-input");
    const bioInput = document.getElementById("bio-input");
    const profilePicDeleteButton = document.getElementById("delete-profile-picture-input");
    const profilePictureUpdateInput = document.getElementById("profile-picture-upload-input");
    const profilePicElement = document.getElementById("profile-pic");

    // Set user data in form fields
    const {name, age, location, email, profilePic, bio} = dummyUser1;

    profilePicElement.src = profilePic;
    nameInput.innerHTML = name;
    ageInput.innerHTML = age;
    locationInput.innerHTML = location;
    emailInput.innerHTML = email;
    bioInput.innerHTML = bio;

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

})