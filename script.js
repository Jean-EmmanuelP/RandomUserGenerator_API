function fetchUsers(gender = "") {
  console.log(`teeee`);
  const userCount = document.getElementById("user-count").value || 1;
  fetch(`https://randomuser.me/api/?results=${userCount}&gender=${gender}`)
    .then((response) => response.json())
    .then((data) => {
      displayUsers(data.results);
    })
    .catch((error) => console.log(error));
}

function displayUsers(newUsers) {
  const usersContainer = document.getElementById("users-container");

  let existingUsers = Array.from(usersContainer.children).map((child) => {
    // Added error handling for each property
    return {
      picture: {
        large: child.querySelector("img") ? child.querySelector("img").src : "",
      },
      name: {
        first: child.querySelector("h2")
          ? child.querySelector("h2").textContent.split(" ")[0]
          : "",
        last: child.querySelector("h2")
          ? child.querySelector("h2").textContent.split(" ")[1]
          : "",
      },
      email:
        child.querySelectorAll("p").length > 0
          ? child.querySelectorAll("p")[0].textContent.replace("Email: ", "")
          : "",
      gender: child.getAttribute("data-gender") || "",
      nat: child.getAttribute("data-nationality") || "",
      address: child.location
        ? `${child.location.street.number} ${child.location.street.name}, ${child.location.city}, ${child.location.state}, ${child.location.country}, ${child.location.postcode}`
        : "",
      phone: child.querySelector(".phone")
        ? child.querySelector(".phone").textContent.replace("Phone: ", "")
        : "",
      password: child.querySelector(".password")
        ? child.querySelector(".password").textContent.replace("Password: ", "")
        : "",
      dob: {
        date:
          child.querySelectorAll("p").length > 1
            ? new Date(
                child
                  .querySelectorAll("p")[1]
                  .textContent.replace("Date of Birth: ", "")
              )
            : new Date(),
      },
    };
  });

  let allUsers = existingUsers.concat(newUsers);

  allUsers.sort((a, b) => new Date(a.dob.date) - new Date(b.dob.date));

  usersContainer.innerHTML = "";
  allUsers.forEach((user, index) => {
    const userDiv = document.createElement("div");
    if (!userDiv) {
      console.error("Failed to create a div element for the user card.");
      return;
    }
    userDiv.className = "user-card";
    userDiv.id = `user-${index}`;
    userDiv.innerHTML = `
    <div class="imgbox">
        <img src="${user.picture.large}" alt="Profile Picture of ${user.name.first}"></div>
        <h2 class="name" id="name-${index}"><span class="label">Hi, my name is</span><br/><span class="value">${user.name.first} ${user.name.last}</span></h2>
        <div class="emojis" id="emojis-${index}">
          <div class="person_logo">
            <img src="/svg/person.svg" alt="name_logo" />
          </div>
          <div class="email_logo">
          <img src="/svg/mail.svg" alt="email_logo" />
          </div>
          <div class="calendar_logo">
            <img src="/svg/calendar.svg" alt="calendar_logo" />
            </div>
          <div class="maps_logo">
            <img src="/svg/maps.svg" alt="maps_logo" />
            </div>
          <div class="phone_logo">
          <img src="/svg/phone.svg" alt="phone_logo" />
          </div>
          <div class="lock_logo">
            <img src="/svg/lock.svg" alt="lock_logo" />
          </div>
        </div>
        <button class="delete_button" onclick="deleteUserCard('user-${index}')">Delete this user</button>
      `;
    if (userDiv) {
      userDiv.setAttribute("data-gender", user.gender || "unknown");
      userDiv.setAttribute("data-nationality", user.nat || "unknown");
    }
    if (newUsers.find((u) => u.id === user.id)) {
      userDiv.style.animation = "fadeIn 0.5s ease-out";
    }

    usersContainer.appendChild(userDiv);
  });
  if (!Array.isArray(allUsers)) {
    console.error("Invalid input: allUsers is not an array.");
    return;
  }
  allUsers.forEach((user, index) => {
    const nameLabel = document
      .getElementById(`name-${index}`)
      .querySelector(".label");
    const nameValue = document
      .getElementById(`name-${index}`)
      .querySelector(".value");
    document
      .getElementById(`emojis-${index}`)
      .querySelector(".person_logo")
      .addEventListener("mouseover", () => {
        nameLabel.textContent = "Hi, my name is";
        nameValue.textContent = `${user.name.first} ${user.name.last}`;
      });

    document
      .getElementById(`emojis-${index}`)
      .querySelector(".email_logo")
      .addEventListener("mouseover", () => {
        nameLabel.textContent = "My email address is";
        nameValue.textContent = `${user.email}`;
      });
    document
      .getElementById(`emojis-${index}`)
      .querySelector(".calendar_logo")
      .addEventListener("mouseover", () => {
        nameLabel.textContent = "My birthday is";
        nameValue.textContent = `${user.dob.date}`;
      });
    document
      .getElementById(`emojis-${index}`)
      .querySelector(".calendar_logo")
      .addEventListener("mouseover", () => {
        nameLabel.textContent = "My birthday is";
        nameValue.textContent = new Date(user.dob.date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
      });
    document
      .getElementById(`emojis-${index}`)
      .querySelector(".maps_logo")
      .addEventListener("mouseover", () => {
        nameLabel.textContent = "My address is";
        nameValue.textContent = `${user.location.street.number} ${user.location.street.name}`;
      });

    document
      .getElementById(`emojis-${index}`)
      .querySelector(".phone_logo")
      .addEventListener("mouseover", () => {
        nameLabel.textContent = "My phone number is";
        nameValue.textContent = `${user.phone}`;
      });

    document
      .getElementById(`emojis-${index}`)
      .querySelector(".lock_logo")
      .addEventListener("mouseover", () => {
        nameLabel.textContent = "My password is";
        nameValue.textContent = `${user.login.password}`;
      });
  });
  updateUserCounts();
}

function updateUserCounts() {
  const usersContainer = document.getElementById("users-container");
  const totalUsers = usersContainer.children.length;
  let maleCount = 0,
    femaleCount = 0;

  Array.from(usersContainer.children).forEach((child) => {
    const gender = child.getAttribute("data-gender");
    if (gender === "male") maleCount++;
    if (gender === "female") femaleCount++;
  });

  document.getElementById(
    "user-count-display"
  ).textContent = `Nb d'utilisateurs : ${totalUsers}`;
  document.getElementById(
    "male-count-display"
  ).textContent = `Nb d'hommes : ${maleCount}`;
  document.getElementById(
    "female-count-display"
  ).textContent = `Nb de femmes : ${femaleCount}`;
}

function applyFilters() {
  const selectedGender = document.getElementById("gender-filter").value;
  const selectedNationality =
    document.getElementById("nationality-filter").value;
  const usersContainer = document.getElementById("users-container");

  let count = 0;

  Array.from(usersContainer.children).forEach((userDiv) => {
    const gender = userDiv.getAttribute("data-gender");
    const nationality = userDiv.getAttribute("data-nationality");
    const matchGender = selectedGender === "" || gender === selectedGender;
    const matchNationality =
      selectedNationality === "" || nationality === selectedNationality;

    if (matchGender && matchNationality) {
      userDiv.style.display = "";
      count++;
    } else {
      userDiv.style.display = "none";
    }
  });

  document.getElementById("filter-results-count").style.display = "";
  document.getElementById(
    "filter-results-count"
  ).textContent = `Personnes trouvées : ${count}`;
}

function deleteUserCard(cardId) {
  try {
    const card = document.getElementById(cardId);
    if (!card) {
      console.error("Card not found: ", cardId);
      return;
    }
    card.remove();
  } catch (error) {
    console.error("Error in deleteUserCard: ", error);
  }
}

function switchLanguage(lang) {
  var elements = document.querySelectorAll('[data-lang]');

  elements.forEach(function(el) {
      el.textContent = el.getAttribute('data-lang-' + lang);
  });
}

function clearUsers() {
  const usersContainer = document.getElementById("users-container");
  usersContainer.innerHTML = "";

  updateUserCounts();
}

fetchUsers(10);
