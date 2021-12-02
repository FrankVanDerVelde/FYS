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

    const dataBaseAllInterests = [{
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
    ];

    const userActiveInterestsNames = userOneDummyInterests.map(interestObject => interestObject.name);

    const {name, birthdate, location, email, phoneNumber, profilePic, bio} = dummyUser1;

    const userSessionData = FYSCloud.Session.get("loggedin") ? FYSCloud.Session.get("loggedin").loggedin[0] : {
        "loggedin": [
            {
                "id": 1,
                "email": "jndoe@gmail.com",
                "password": "a98ec5c5044800c88e862f007b98d89815fc40ca155d6ce7909530d792e909ce",
                "username": "testusername0.14031343450985734",
                "profilePhoto": "https://ui-avatars.com/api/?name=jndoe?background=random",
                "usertypeFk": 1,
                "createdAt": "2021-11-29T17:30:55.000Z",
                "updatedAt": null,
                "lastLoggedIn": null
            }
        ]
    };

    try {
        console.log(userSessionData)
        const userData = await FYSCloud.API.queryDatabase("SELECT * FROM person WHERE accountFK = ?",
        [userSessionData.loggedin[0].id]);

        console.log(userData[0]);
    } catch (e) {
        console.error(e);
    }

    const nameInput = document.getElementById("name-input");
    const birthdateInput = document.getElementById("birthdate-input");
    const locationInput = document.getElementById("location-input");
    const phoneNumberInput = document.getElementById("phone-number-input");
    const emailInput = document.getElementById("email-input");
    const bioInput = document.getElementById("bio-input");
    const profilePicDeleteButton = document.getElementById("delete-profile-picture-input");
    const profilePictureUpdateInput = document.getElementById("profile-picture-upload-input");
    const profilePicElement = document.getElementById("profile-pic");
    const saveButton = document.getElementById("save-button");

    profilePicDeleteButton.addEventListener('click', ()=>{
        // Remove database entry for profile picture
    });

    // Set a min and max birthdate on the birthdate picker
    let minAgeBirthdate = new Date();
    minAgeBirthdate.setFullYear(minAgeBirthdate.getFullYear() - 16);
    birthdateInput.min = minAgeBirthdate.toLocaleDateString();

    let maxAgeBirthdate = new Date();
    maxAgeBirthdate.setFullYear(maxAgeBirthdate.getFullYear() - 120);
    birthdateInput.max = maxAgeBirthdate.toLocaleDateString();

    // set database values as current values
    birthdateInput.value = birthdate;
    nameInput.value = name;
    locationInput.value = location;
    phoneNumberInput.value = phoneNumber;
    emailInput.value = email;
    bioInput.value = bio;
    profilePicElement.src = profilePic;

    // Get all new values to update in the database
    saveButton.addEventListener('click', ()=>{
        const newName = nameInput.value;
        const newBirthdate = birthdateInput.value;
        const newLocation = locationInput.value;
        const newPhoneNumber = phoneNumberInput.value;
        const newEmail = emailInput.value;
        const newBio = bioInput.value;
        const newProfilePicture =profilePictureUpdateInput.value;

        const interestsList = [];

        interestsContainer.querySelectorAll(".interest-checkbox-container>input").forEach(checkboxElement => {
            if (checkboxElement.checked === true) {
                interestsList.push(checkboxElement.name);
            }
        })
        // SQL update here
    });

    // Fill interest container with checkboxes
    const interestsContainer = document.getElementById("interest-checkboxes-container");
    dataBaseAllInterests.forEach(interest => {
        let {name} = interest;

        // Make checkbox container
        const interestDiv = document.createElement("div");
        interestDiv.className = "interest-checkbox-container";

        // Make checkbox input
        const interestCheckbox = document.createElement("input");
        interestCheckbox.type = "checkbox";
        interestCheckbox.id = name;
        interestCheckbox.name = name;

        // Check if the user has the interest in the database and if so make the box checked
        if (userActiveInterestsNames.includes(name)) {
            interestCheckbox.checked = true;
        }
       
        // Make checkbox label
        const interestLabel = document.createElement("label");
        interestLabel.setAttribute("for",name);
        const interestLabelSpan = document.createTextNode(name);
        interestLabel.append(interestLabelSpan);
        
        // Append input and label to checkbox div
        interestDiv.append(interestCheckbox);
        interestDiv.append(interestLabel);

        // Append checkbox div to checkboxes container
        interestsContainer.append(interestDiv)
    });

});