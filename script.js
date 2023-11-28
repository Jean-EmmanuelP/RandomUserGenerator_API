var currentLanguage = "fr";

function fetchUsers(gender = "") {
  const userCount = document.getElementById("user-count").value || 1;
  const usersContainer = document.getElementById("users-container");
  if (userCount > 5000 || userCount < 1) {
    alert("Le nombre doit être compris entre 1 et 5000")
    return;
  }
  if (userCount > 1000) {
    const proceed = confirm(
      "Charger un grand nombre d'utilisateurs peut prendre du temps. Voulez-vous continuer ?"
    );
    if (!proceed) return;
  }
  if (userCount > 1000) {
    usersContainer.innerHTML =
      '<div class="loading">Chargement en cours...</div>';
  }

  fetch(`https://randomuser.me/api/?results=${userCount}&gender=${gender}`)
    .then((response) => response.json())
    .then((data) => {
      displayUsers(data.results);
    })
    .catch((error) => console.log(error));
}

function displayUsers(newUsers) {
  const usersContainer = document.getElementById("users-container");

  let allUsers = getExistingUsers(usersContainer).concat(newUsers);

  allUsers.sort((a, b) => new Date(a.dob.date) - new Date(b.dob.date));

  const fragment = document.createDocumentFragment();
  allUsers.forEach((user, index) => {
    const userDiv = createUserDiv(user, index);
    fragment.appendChild(userDiv);
  });

  usersContainer.innerHTML = "";
  usersContainer.appendChild(fragment);
  // updateUserCounts();
}

function createUserDiv(user, index) {
  const userDiv = document.createElement("div");
  userDiv.className = "user-card";
  userDiv.id = `user-${index}`;
  userDiv.setAttribute("data-gender", user.gender || "unknown");
  userDiv.setAttribute("data-nationality", user.nat || "unknown");

  userDiv.innerHTML = `
    <div class="imgbox">
      <img src="${user.picture.large}" alt="Profile Picture of ${user.name.first} ${user.name.last}">
    </div>
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
    <button class="delete_button" onclick="deleteUserCard('user-${index}')" data-lang data-lang-en="Delete this user" data-lang-fr="Supprimer cet utilisateur" >Supprimer cet utilisateur</button>
  `;

  addIconEventListeners(userDiv, user, index);
  const firstIcon = userDiv.querySelector(".person_logo");
  if (firstIcon) {
    firstIcon.classList.add("active");
  }
  return userDiv;
}

function addIconEventListeners(userDiv, user, index) {
  const nameLabel = userDiv.querySelector(`#name-${index} .label`);
  const nameValue = userDiv.querySelector(`#name-${index} .value`);

  const icons = userDiv.querySelectorAll(".emojis div");

  function activateIcon(icon) {
    icons.forEach((ic) => ic.classList.remove("active"));
    icon.classList.add("active");
  }

  userDiv
    .querySelector(".person_logo")
    .addEventListener("mouseover", function () {
      activateIcon(this);
      updateLabelText(nameLabel, "Hi, my name is", "Salut, je suis");
      nameValue.textContent = `${user.name.first} ${user.name.last}`;
    });

  userDiv
    .querySelector(".email_logo")
    .addEventListener("mouseover", function () {
      activateIcon(this);
      updateLabelText(
        nameLabel,
        "My email address is",
        "Mon adresse email est"
      );
      nameValue.textContent = user.email;
    });

  userDiv
    .querySelector(".calendar_logo")
    .addEventListener("mouseover", function () {
      activateIcon(this);
      updateLabelText(nameLabel, "My birthday is", "Je suis né le");
      nameValue.textContent = new Date(user.dob.date).toLocaleDateString(
        currentLanguage === "fr" ? "fr-FR" : "en-US"
      );
    });

  userDiv
    .querySelector(".maps_logo")
    .addEventListener("mouseover", function () {
      activateIcon(this);
      updateLabelText(nameLabel, "My address is", "Mon adresse est");
      nameValue.textContent = `${user.location.street.number} ${user.location.street.name}`;
    });

  userDiv
    .querySelector(".phone_logo")
    .addEventListener("mouseover", function () {
      activateIcon(this);
      updateLabelText(
        nameLabel,
        "My phone number is",
        "Mon numéro de téléphone est"
      );
      nameValue.textContent = user.phone;
    });

  userDiv
    .querySelector(".lock_logo")
    .addEventListener("mouseover", function () {
      activateIcon(this);
      updateLabelText(nameLabel, "My password is", "Mon mot de passe est");
      nameValue.textContent = `${user.login.password}`;
    });
}

function updateLabelText(label, textEn, textFr) {
  label.textContent = currentLanguage !== "fr" ? textEn : textFr;
}

function getExistingUsers(usersContainer) {
  return Array.from(usersContainer.children).map((child) => {
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
      address: extractAddressFromChild(child),
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
}

function extractAddressFromChild(child) {
  const addressElement = child.querySelector(".address");
  return addressElement ? addressElement.textContent : "";
}

function toggleStatistics() {
  var statisticsContent = document.getElementById("statistics-content");
  if (statisticsContent.style.display === "none") {
    statisticsContent.style.display = "flex";
  } else {
    statisticsContent.style.display = "none";
  }
}

// function updateUserCounts() {
//   const usersContainer = document.getElementById("users-container");
//   const totalUsers = usersContainer.children.length;
//   let maleCount = 0,
//     femaleCount = 0;

//   Array.from(usersContainer.children).forEach((child) => {
//     const gender = child.getAttribute("data-gender");
//     if (gender === "male") maleCount++;
//     if (gender === "female") femaleCount++;
//   });

//   console.log("Current language:", currentLanguage);

//   updateTextContent(
//     "user-count-display",
//     totalUsers,
//     "Number of users:",
//     "Nb d'utilisateurs :",
//     currentLanguage
//   );
//   updateTextContent(
//     "male-count-display",
//     maleCount,
//     "Number of men:",
//     "Nb d'hommes :",
//     currentLanguage
//   );
//   updateTextContent(
//     "female-count-display",
//     femaleCount,
//     "Number of women:",
//     "Nb de femmes :",
//     currentLanguage
//   );
// }

function updateTextContent(elementId, count, textEn, textFr, lang) {
  var element = document.getElementById(elementId);

  if (lang === "en") {
    element.textContent = `${textEn} ${count}`;
  } else {
    element.textContent = `${textFr} ${count}`;
  }
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
  var elements = document.querySelectorAll("[data-lang]");
  currentLanguage = lang;

  elements.forEach(function (el) {
    el.textContent = el.getAttribute("data-lang-" + lang);
  });
}

function clearUsers() {
  const usersContainer = document.getElementById("users-container");
  usersContainer.innerHTML = "";

  // updateUserCounts();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowDown") {
    window.scrollBy(0, 100);
  } else if (event.key === "ArrowUp") {
    window.scrollBy(0, -100);
  }
});

document.getElementById("user-count").addEventListener("input", function () {
  var value = parseInt(this.value, 10);
  var errorMessage = document.getElementById("errorMessage");
  if (value < 1 || value > 5000) {
    errorMessage.style.display = "flex";
  } else {
    errorMessage.style.display = "none";
  }
});

fetchUsers(10);
