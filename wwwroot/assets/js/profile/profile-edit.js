document.addEventListener("DOMContentLoaded", async function () {
    const loggedin = FYSCloud.Session.get("loggedin")
    const userId = loggedin[0].id;

    let allInterests;
    try {
        allInterests = await FYSCloud.API.queryDatabase(`SELECT interestId, description, imageLink FROM interestdetail`)
    } catch (e) {
        console.error(e);
    }

    const userInterests = await getUserInterests(userId);
    const maxInterests = 8;

    let userData;
    try {
        userData = await FYSCloud.API.queryDatabase(`SELECT * FROM account WHERE id =${userId};`)
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
    } = userData[0];

    const nameInput = document.getElementById("name-input");
    const birthdateInput = document.getElementById("birthdate-input");
    const locationInput = document.getElementById("location-input");
    const phoneNumberInput = document.getElementById("phone-number-input");
    const genderInput = document.getElementById("gender-select");
    const emailInput = document.getElementById("email-input");
    const bioInput = document.getElementById("bio-input");
    const profilePicDeleteButton = document.getElementById("delete-profile-picture-input");
    const profilePictureUpdateInput = document.getElementById("profile-picture-upload-input");
    const profilePicElement = document.getElementById("profile-pic");
    const saveButton = document.getElementById("save-button");

    // Set a min and max birthdate on the birthdate picker
    let minAgeBirthdate = new Date();
    minAgeBirthdate.setFullYear(minAgeBirthdate.getFullYear() - 16);
    birthdateInput.min = minAgeBirthdate.toLocaleDateString();

    let maxAgeBirthdate = new Date();
    maxAgeBirthdate.setFullYear(maxAgeBirthdate.getFullYear() - 120);
    birthdateInput.max = maxAgeBirthdate.toLocaleDateString();

    // set database values as current values
    birthdateInput.valueAsDate = new Date(birthdate);
    nameInput.value = name;
    locationInput.value = location;
    phoneNumberInput.value = phonenumber;
    emailInput.value = email;
    bioInput.value = bio;
    profilePicElement.src = (profilePhoto ? profilePhoto : `https://ui-avatars.com/api/?name=${name}?background=#e0dcdc`);

    let newProfilePicDataUrl;
    profilePictureUpdateInput.addEventListener('change', async () => {
        newProfilePicDataUrl = await FYSCloud.Utils.getDataUrl(profilePictureUpdateInput);
        if (newProfilePicDataUrl.isImage) {
            profilePicElement.src = newProfilePicDataUrl.url;
        }
        deleteProfilePicture = false;
    })

    // Delete profile pic
    let deleteProfilePicture = false;
    profilePicDeleteButton.addEventListener('click', async () => {
        profilePicElement.src = `https://ui-avatars.com/api/?name=${name}?background=#e0dcdc`;
        deleteProfilePicture = true;
    });

    // Get all new values to update in the database
    let savedButtonClicked = false;
    saveButton.addEventListener('click', async () => {
        if (!savedButtonClicked) {
            savedButtonClicked = true;

            const newName = nameInput.value;
            const newBirthdate = birthdateInput.value;
            const newLocation = locationInput.value;
            const newPhoneNumber = phoneNumberInput.value;
            const newEmail = emailInput.value;
            const newBio = bioInput.value;
            const newGender = genderInput.value;

            if (deleteProfilePicture) {
                try {
                    await FYSCloud.API.queryDatabase("UPDATE account SET profilePhoto = NULL WHERE id = ?", [userId]);
                    FYSCloud.API.deleteFile(profilePhoto);
                } catch (e) {
                    console.log(e);
                }
            }

            if (newProfilePicDataUrl) {
                const newProfilePicUrl = `profile-image-user-${userId}.${newProfilePicDataUrl.extension}`;
                await FYSCloud.API.uploadFile(newProfilePicUrl, newProfilePicDataUrl.url, true);

                // If host is one of the fys clouds use that hosts url. Otherwise fall back on the mockup
                const hostName = (new URL(window.location).hostname.includes('is109')) ? 'https://' + new URL(window.location).hostname : 'https://mockup-is109-4.fys.cloud';
                console.log(hostName)
                try {
                    await FYSCloud.API.queryDatabase("UPDATE account SET name = ?, birthdate = ?, location = ?, phonenumber = ?, email = ?, bio = ?, profilePhoto = ?, genderFk = ? WHERE id = ?",
                        [newName, newBirthdate, newLocation, newPhoneNumber, newEmail, newBio, hostName + '/uploads/' + newProfilePicUrl, newGender, userId]);
                } catch (e) {
                    console.error(e);
                }
            } else {
                try {
                    await FYSCloud.API.queryDatabase("UPDATE account SET name = ?, birthdate = ?, location = ?, phonenumber = ?, email = ?, bio = ?, genderFk = ? WHERE id = ?",
                        [newName, newBirthdate, newLocation, newPhoneNumber, newEmail, newBio, newGender, userId]);
                } catch (e) {
                    console.error(e);
                }
            }

            const newActiveInterestList = [];
            interestsContainer.querySelectorAll(".interests-checkboxes-container>.interest-checkbox-container>input").forEach(checkboxElement => {
                if (checkboxElement.checked === true) {
                    newActiveInterestList.push(checkboxElement.name);
                }
            })

            const interestsToRemove = [];
            const interestsToAdd = [];
            allInterests.forEach(interest => {
                const {
                    description: interstName,
                    interestId
                } = interest;

                if (userInterests.includes(interstName) && !newActiveInterestList.includes(interstName)) {
                    interestsToRemove.push(interestId);
                } else if (!userInterests.includes(interstName) && newActiveInterestList.includes(interstName)) {
                    interestsToAdd.push(`('${userId}', '${interestId}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`);
                }
            })

            if (interestsToRemove.length != 0) {
                try {
                    await FYSCloud.API.queryDatabase(`DELETE FROM userinterests WHERE accountFk = ${userId} AND interestsFk IN ('${interestsToRemove.join("', '")}');`);
                } catch (e) {
                    console.log(e);
                }
            }

            if (interestsToAdd.length != 0) {
                try {
                    await FYSCloud.API.queryDatabase(`INSERT INTO userinterests (accountFk, interestsFk, createdAt) VALUES ${interestsToAdd.join(',')}`);
                } catch (e) {
                    console.log(e);
                }
            }
            window.alert('Profiel aanpassingen opgeslagen');
            window.location.replace(window.location.href.slice(0, window.location.href.lastIndexOf('/')) + '/profile.html');
        }
    });

    // Generate gender options
    genders.forEach(gender => {
        let genderOption = document.createElement('option');
        genderOption.value = gender.id;
        genderOption.innerHTML = gender.name;
        genderOption.id = `lang-${gender.name.toLowerCase()}`;
        genderInput.appendChild(genderOption);
    });

    // check if a gender is set then set it active in the input
    if (genderFk) {
        genderInput.value = genderFk;
    }

    // Fill interest container with checkboxes
    const interestsContainer = document.getElementById("interest-containers-holder");

    let interestCounter = 0;
    let interestContainerCount = 0;
    let interestTabDiv;
    for (i = 0; i < allInterests.length; i++) {
        // If interest count is 0 make a new div
        if (interestCounter == 0) {
            interestTabDiv = document.createElement("div");
            interestTabDiv.id = `interest-tab-${interestContainerCount}`;
            interestTabDiv.className = "interests-checkboxes-container"

            if (interestContainerCount == 0) {
                interestTabDiv.className = "interests-checkboxes-container active";
            }
        }

        const {
            interestId,
            description: interestName,
            imageLink
        } = allInterests[i];
        // Make checkbox container
        const interestDiv = document.createElement("div");
        interestDiv.className = "interest-checkbox-container";

        // Make checkbox input
        const interestCheckbox = document.createElement("input");
        interestCheckbox.type = "checkbox";
        interestCheckbox.id = interestName;
        interestCheckbox.name = interestName;

        // Check if the user has the interest in the database and if so make the box checked
        if (userInterests.includes(interestName)) {
            interestCheckbox.checked = true;
            // interestCheckbox.setAttribute("checked", true);
        }

        // Make checkbox label
        const interestLabel = document.createElement("label");
        interestLabel.setAttribute("for", interestName);
        interestLabel.id = `lang-${interestName.toLowerCase().replaceAll(' ', '-') }`;
        const interestLabelSpan = document.createTextNode(interestName);
        interestLabel.append(interestLabelSpan);

        // Append input and label to checkbox div
        interestDiv.append(interestCheckbox);
        interestDiv.append(interestLabel);

        // Append checkbox div to checkboxes container
        interestTabDiv.append(interestDiv)

        if (interestCounter == 11 || i == allInterests.length) {
            interestContainerCount++;
            // append interest tab
            // reset to 0
            interestsContainer.append(interestTabDiv);
        }

        interestCounter++;

        if (interestCounter > 11) {
            interestCounter = 0;
        }
    }

    const paginationBackButton = document.getElementById('pagination-back');
    const paginationForwardButton = document.getElementById('pagination-forward');

    // Create pagination
    const paginationContainer = document.getElementById("pagination-container");
    for (i = 0; i < interestContainerCount; i++) {
        const paginationElement = document.createElement("span");
        const paginationText = document.createTextNode(i + 1);
        paginationElement.className = "pagination-element";
        paginationElement.setAttribute('number', i);
        if (i == 0) {
            paginationElement.className = "pagination-element active";
        }
        paginationElement.append(paginationText);
        paginationForwardButton.before(paginationElement);
    }

    const paginationTabsNum = document.querySelectorAll('.pagination-element').length;
    paginationBackButton.addEventListener('click', () => {
        const activePaginationElement = document.querySelector('.pagination-element.active');
        const activePaginationElementNum = parseInt(activePaginationElement.getAttribute('number'));
        console.log(activePaginationElementNum !== 0);
        console.log(activePaginationElementNum + 1 <= paginationTabsNum)
        if (activePaginationElementNum !== 0 && activePaginationElementNum + 1 <= paginationTabsNum) {
            document.querySelector(`.pagination-element[number="${activePaginationElementNum - 1}"]`).classList.toggle('active');
            activePaginationElement.classList.toggle('active');
            document.querySelector(".interests-checkboxes-container.active").classList.toggle('active');
            document.querySelectorAll(".interests-checkboxes-container")[activePaginationElementNum - 1].classList.toggle('active');
        }
    })

    paginationForwardButton.addEventListener('click', () => {
        const activePaginationElement = document.querySelector('.pagination-element.active');
        const activePaginationElementNum = parseInt(activePaginationElement.getAttribute('number'));

        if (activePaginationElementNum + 1 !== paginationTabsNum) {
            document.querySelector(`.pagination-element[number="${activePaginationElementNum + 1}"]`).classList.toggle('active');
            activePaginationElement.classList.toggle('active');
            document.querySelector(".interests-checkboxes-container.active").classList.toggle('active');
            document.querySelectorAll(".interests-checkboxes-container")[activePaginationElementNum + 1].classList.toggle('active');
        }
    })

    // Add on clicks to pagination
    document.querySelectorAll(".pagination-element").forEach(paginationElement => {
        paginationElement.addEventListener('click', function (event) {
            // Remove active from currently active element
            document.querySelector(".pagination-element.active").classList.toggle('active');

            // Add active class to clicked button
            this.classList.toggle('active');

            //  Remove active class from interest container that currently has it
            document.querySelector(".interests-checkboxes-container.active").classList.toggle('active');

            // Use number of pagination button to activate the corrosponding checkbox div
            document.querySelectorAll(".interests-checkboxes-container")[this.getAttribute('number')].classList.toggle('active');
        })
    })

    const interestCheckBoxLabels = document.querySelectorAll(".interest-checkbox-container>label");
    const interestCheckBoxes = document.querySelectorAll('.interest-checkbox-container>input');
    const maxInterestLabel = document.getElementById("max-interest-label");

    // Checks if max interest reached
    let initialCall = true;

    function maxInterestCheck() {
        // Add a micro delay because of a bug where the queryselectall takes the elements before the browser is finished unchecking the one that was clicked
        setTimeout(function () {
            const activeInterestCheckBoxes = document.querySelectorAll('.interest-checkbox-container>input:checked');
            let activeCheckBoxCount = activeInterestCheckBoxes.length;
            if (activeCheckBoxCount == maxInterests) {
                if (initialCall == false) {
                    // Turn shake on
                    maxInterestLabel.classList.toggle('shake');
                    // Turn shake off
                    setTimeout(function () {
                        maxInterestLabel.classList.toggle('shake')
                    }, 1000);
                }

                interestCheckBoxes.forEach(checkBox => {
                    if (!checkBox.checked) {
                        checkBox.disabled = true;
                    }
                });
            } else {

                interestCheckBoxes.forEach(checkBox => {
                    if (checkBox.disabled) {
                        checkBox.disabled = false;
                    }
                });

            }
            initialCall = false;
        }, 25);

    }
    maxInterestCheck();

    // Add on clicks to interests
    interestCheckBoxLabels.forEach(element => {
        element.addEventListener('click', function (event) {
            maxInterestCheck();
        })
    });
});