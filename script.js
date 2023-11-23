function fetchUsers(gender = "") {
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
    return {
      picture: { large: child.querySelector("img").src },
      name: {
        first: child.querySelector("h2").textContent.split(" ")[0],
        last: child.querySelector("h2").textContent.split(" ")[1],
      },
      email: child.querySelectorAll("p")[0].textContent.replace("Email: ", ""),
      gender: child.getAttribute("data-gender"),
      nat: child.getAttribute("data-nationality"),
      dob: {
        date: new Date(
          child
            .querySelectorAll("p")[1]
            .textContent.replace("Date of Birth: ", "")
        ),
      },
    };
  });

  let allUsers = existingUsers.concat(newUsers);

  allUsers.sort((a, b) => new Date(a.dob.date) - new Date(b.dob.date));

  usersContainer.innerHTML = "";
  allUsers.forEach((user, index) => {
    const userDiv = document.createElement("div");
    userDiv.className = "user-card";
    userDiv.id = `user-${index}`;
    userDiv.innerHTML = `
        <img src="${user.picture.large}" alt="Profile Picture of ${
      user.name.first
    }">
        <h2>${user.name.first} ${user.name.last}</h2>
        <p>Email: ${user.email}</p>
        <p>Date of Birth: ${new Date(user.dob.date).toDateString()}</p>
        <button onclick="deleteUserCard('user-${index}')">Delete</button>
      `;
    userDiv.setAttribute("data-gender", user.gender);
    userDiv.setAttribute("data-nationality", user.nat);
    if (newUsers.find((u) => u.id === user.id)) {
      userDiv.style.animation = "fadeIn 0.5s ease-out";
    }

    usersContainer.appendChild(userDiv);
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
  ).textContent = `Nombre d'utilisateurs : ${totalUsers}`;
  document.getElementById(
    "male-count-display"
  ).textContent = `Nombre d'hommes : ${maleCount}`;
  document.getElementById(
    "female-count-display"
  ).textContent = `Nombre de femmes : ${femaleCount}`;
}

function applyFilters() {
  const selectedGender = document.getElementById("gender-filter").value;
  const selectedNationality =
    document.getElementById("nationality-filter").value;
  const usersContainer = document.getElementById("users-container");

  Array.from(usersContainer.children).forEach((userDiv) => {
    const gender = userDiv.getAttribute("data-gender");
    const nationality = userDiv.getAttribute("data-nationality");
    const matchGender = selectedGender === "" || gender === selectedGender;
    const matchNationality =
      selectedNationality === "" || nationality === selectedNationality;

    if (matchGender && matchNationality) {
      userDiv.style.display = "";
    } else {
      userDiv.style.display = "none";
    }
    let count = 0;
    if (userDiv.style.display !== "none") {
      count++;
    }
    document.getElementById(
      "filter-results-count"
    ).textContent = `Personnes trouvées : ${count}`;
  });
}

function deleteUserCard(cardId) {
  const card = document.getElementById(cardId);
  card.remove();
  updateUserCounts();
}

function clearUsers() {
  const usersContainer = document.getElementById("users-container");
  usersContainer.innerHTML = "";

  updateUserCounts();
}

fetchUsers();
