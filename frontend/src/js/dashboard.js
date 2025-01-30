document.addEventListener("DOMContentLoaded", () => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("userName").textContent = user.firstName;
  } else {
    // window.location.href = "login.html"; // Redirect if not logged in
    console.log("User not logged in");
  }

  // Modal Elements
  const modal = document.getElementById("addContactModal");
  const addBtn = document.querySelector(".add-btn");
  const closeBtn = document.querySelector(".close");
  const cancelBtn = document.querySelector(".cancel-btn");
  const addContactForm = document.getElementById("addContactForm");

  // Modal Controls
  addBtn.onclick = function () {
    modal.style.display = "block";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  cancelBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Contact CRUD Operations
  let contacts = [];

  // Handle Add Contact Form Submission
  addContactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const contactData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      pNumber: document.getElementById("contactPhone").value,
      email: document.getElementById("contactEmail").value,
      userId: user.id,
    };

    await createContact(contactData);
    addContactForm.reset();
    modal.style.display = "none";
  });

  // Read Contacts
  async function loadContacts() {
    try {
      const response = await fetch("/backend/api/SearchContact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          search: "",
        }),
      });

      const data = await response.json();
      contacts = data.results || [];
      displayContacts(contacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  }

  // Create Contact
  async function createContact(contactData) {
    try {
      const response = await fetch("/backend/api/AddContact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      if (!data.error) {
        loadContacts(); // Refresh the contact list
      } else {
        alert("Error adding contact: " + data.error);
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("Error adding contact");
    }
  }

  // Update Contact
  async function updateContact(contactId, updatedData) {
    try {
      const response = await fetch("/backend/api/UpdateContact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: contactId,
          ...updatedData,
        }),
      });

      const data = await response.json();
      if (!data.error) {
        loadContacts(); // Refresh the contact list
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  }

  // Delete Contact
  async function deleteContact(contactId) {
    if (confirm("Are you sure you want to delete this contact?")) {
      try {
        const response = await fetch("/backend/api/DeleteContact.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: contactId,
          }),
        });

        const data = await response.json();
        if (!data.error) {
          loadContacts(); // Refresh the contact list
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  }

  // Display Contacts
  function displayContacts(contacts) {
    const contactsGrid = document.querySelector(".contacts-grid");
    contactsGrid.innerHTML = ""; // Clear existing contacts

    if (contacts.length === 0) {
      contactsGrid.innerHTML = '<p class="no-contacts">No contacts found</p>';
      return;
    }

    contacts.forEach((contact) => {
      const contactCard = document.createElement("div");
      contactCard.className = "contact-card";
      contactCard.innerHTML = `
                <div class="contact-info">
                    <h3>${contact.firstName} ${contact.lastName}</h3>
                    <p>${contact.email}</p>
                    <p>${contact.phone}</p>
                </div>
                <div class="card-actions">
                    <button class="edit-btn"> Edit </button> 
                    <button class="delete-btn">Delete</button>
                </div>
            `;
      
      const editBtn = contactCard.querySelector(".edit-btn"); //getting the edit button we just added to our contact card above throught its class name
      const deleteBtn = contactCard.querySelector(".delete-btn"); //getting the delete button we just added to our contact card above throught its class name

      //had to add event listeners to the buttons so that on click we can call the update and delete functions. Before the functions were being called on
      //the buttons above inside the innerHTML. Like so onclick="updateContact(${contact.id})". However this doesnt work because innerHTML is static and  expects
      //all eventhandlers to be globally available. These functions are inside DOMContentLoaded so they arent globally available.
      editBtn.addEventListener("click", () => {updateContact(contact.id)});
      deleteBtn.addEventListener("click", () => {deleteContact(contact.id)});

      contactsGrid.appendChild(contactCard);
    });
  }

  // Search Functionality
  const searchInput = document.querySelector(".search-bar input");
  let searchTimeout;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchContacts(e.target.value);
    }, 300);
  });

  async function searchContacts(searchTerm) {
    try {
      const response = await fetch("/backend/api/SearchContacts.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          search: searchTerm,
        }),
      });

      const data = await response.json();
      if (!data.error) {
        displayContacts(data.results || []);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  }

  // Initial load of contacts runs as soon as the page loads
  loadContacts();
});
