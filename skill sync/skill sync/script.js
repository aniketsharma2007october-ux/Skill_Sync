// ========================================
// SkillSync - Student Skill Exchange
// ========================================

// Default student data
const defaultStudents = [
    {
        id: 1,
        name: "Aman Kumar",
        bio: "MCA student · Enjoys coding",
        about:
            "I enjoy solving problems with code and want to improve my visual design skills.",
        teaches: ["Python", "SQL"],
        learns: ["Graphic Design"],
    },
    {
        id: 2,
        name: "Rahul Sharma",
        bio: "Design enthusiast · Creative thinker",
        about:
            "I enjoy creating clean visual designs and want to learn Python programming.",
        teaches: ["Graphic Design", "Photoshop"],
        learns: ["Python"],
    },
    {
        id: 3,
        name: "Priya Verma",
        bio: "Programmer · Web enthusiast",
        about:
            "I like building web projects and want to strengthen my database skills.",
        teaches: ["Java", "HTML"],
        learns: ["SQL"],
    },
    {
        id: 4,
        name: "Neha Singh",
        bio: "Frontend learner · Curious creator",
        about:
            "I enjoy frontend development and want to learn Java from another student.",
        teaches: ["HTML", "CSS"],
        learns: ["Java"],
    },
    {
        id: 5,
        name: "Karan Mehta",
        bio: "Python learner · Data curious",
        about:
            "I am interested in data and would like to learn SQL while sharing Python basics.",
        teaches: ["Python"],
        learns: ["SQL"],
    },
    {
        id: 6,
        name: "Sana Ali",
        bio: "Digital artist · Design student",
        about:
            "I create digital illustrations and want to improve my Photoshop workflow.",
        teaches: ["Graphic Design"],
        learns: ["Photoshop"],
    },
];

const STORAGE_KEY = "skillsync-profile-v1";

// Copy default data to avoid modifying the original array.
let students = defaultStudents.map((student) => ({
    ...student,
    teaches: [...student.teaches],
    learns: [...student.learns],
}));

// Load the saved profile from localStorage.
try {
    const savedProfile = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
    );

    if (savedProfile && typeof savedProfile === "object") {
        const ownProfile = students.find((student) => student.id === 1);

        Object.assign(ownProfile, savedProfile, { id: 1 });

        if (!Array.isArray(savedProfile.teaches)) {
            ownProfile.teaches = ["Python", "SQL"];
        }

        if (!Array.isArray(savedProfile.learns)) {
            ownProfile.learns = ["Graphic Design"];
        }
    }
} catch (error) {
    console.error("Unable to load saved profile:", error);
}

// ========================================
// Helper Functions
// ========================================

// Escape HTML to prevent user input from becoming HTML markup.
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });
}

// Create skill tags.
function makeTags(skills, className = "") {
    return skills
        .map(
            (skill) =>
                `<span class="tag ${className}">${escapeHTML(skill)}</span>`
        )
        .join("");
}

// Find students who can exchange skills with each other.
function findMatches(student) {
    return students.filter((other) => {
        if (student.id === other.id) {
            return false;
        }

        const canLearn = student.learns.some((skill) =>
            other.teaches.some(
                (otherSkill) =>
                    otherSkill.toLowerCase() === skill.toLowerCase()
            )
        );

        const canExchange = other.learns.some((skill) =>
            student.teaches.some(
                (otherSkill) =>
                    otherSkill.toLowerCase() === skill.toLowerCase()
            )
        );

        return canLearn && canExchange;
    });
}

// Create a student card.
function studentCard(student) {
    const matches = findMatches(student);

    return `
    <article class="student-card">

      <div class="avatar" aria-hidden="true">
        ${escapeHTML(student.name.charAt(0).toUpperCase())}
      </div>

      <h3>${escapeHTML(student.name)}</h3>

      <p class="bio">
        ${escapeHTML(student.bio)}
      </p>

      <div class="skill-group">
        <span class="skill-title">Can teach</span>

        <div class="tags">
          ${makeTags(student.teaches)}
        </div>
      </div>

      <div class="skill-group">
        <span class="skill-title">Wants to learn</span>

        <div class="tags">
          ${makeTags(student.learns, "learn")}
        </div>
      </div>

      <p class="match-note">
        ${matches.length
            ? `${matches.length} potential skill match${matches.length === 1 ? "" : "es"}`
            : "Still looking for a skill partner"
        }
      </p>

      <a
        class="profile-link"
        href="profile.html?id=${student.id}"
      >
        View profile →
      </a>

    </article>
  `;
}

// ========================================
// Search Page
// ========================================

const studentList = document.getElementById("studentList");

if (studentList) {
    const searchInput = document.getElementById("skillSearch");
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("resultCount");

    function renderStudents() {
        const query = searchInput.value.trim().toLowerCase();

        const filteredStudents = students.filter((student) => {
            const searchableText = [
                student.name,
                student.bio,
                student.about,
                ...student.teaches,
                ...student.learns,
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });

        studentList.innerHTML = filteredStudents
            .map(studentCard)
            .join("");

        emptyState.hidden = filteredStudents.length > 0;

        resultCount.textContent =
            `${filteredStudents.length} student` +
            (filteredStudents.length === 1 ? "" : "s");
    }

    searchInput.addEventListener("input", renderStudents);

    renderStudents();
}

// ========================================
// Profile Page
// ========================================

const profileDetails = document.getElementById("profileDetails");

if (profileDetails) {
    const params = new URLSearchParams(window.location.search);

    const requestedId = Number(params.get("id")) || 1;

    const student =
        students.find((item) => item.id === requestedId) || students[0];

    const isOwnProfile = student.id === 1;

    const matchesContainer =
        document.getElementById("profileMatches");

    const emptyState =
        document.getElementById("profileEmptyState");

    const editButton =
        document.getElementById("editProfileButton");

    const editPanel =
        document.getElementById("editProfilePanel");

    const editForm =
        document.getElementById("editProfileForm");

    const saveMessage =
        document.getElementById("saveMessage");

    // Render profile details and potential matches.
    function renderProfile() {
        profileDetails.innerHTML = `
      <div class="profile-top">

        <div class="profile-avatar" aria-hidden="true">
          ${escapeHTML(student.name.charAt(0).toUpperCase())}
        </div>

        <div>
          <p class="eyebrow">STUDENT PROFILE</p>

          <h2>${escapeHTML(student.name)}</h2>

          <p>${escapeHTML(student.bio)}</p>
        </div>

      </div>

      <div class="profile-columns">

        <div>
          <h3>Skills I can teach</h3>

          <div class="tags">
            ${makeTags(student.teaches)}
          </div>
        </div>

        <div>
          <h3>Skills I want to learn</h3>

          <div class="tags">
            ${makeTags(student.learns, "learn")}
          </div>
        </div>

      </div>

      <p class="profile-about">
        ${escapeHTML(student.about)}
      </p>
    `;

        const matches = findMatches(student);

        matchesContainer.innerHTML = matches
            .map(studentCard)
            .join("");

        emptyState.hidden = matches.length > 0;
    }

    // Display the profile.
    renderProfile();

    // Only allow editing the current user's demo profile.
    if (!isOwnProfile && editButton) {
        editButton.hidden = true;

        const hint = document.querySelector(".profile-actions .hint");

        if (hint) {
            hint.textContent =
                "Only your own demo profile can be edited.";
        }
    }

    // Fill the edit form with existing information.
    function fillForm() {
        document.getElementById("editName").value = student.name;

        document.getElementById("editBio").value = student.bio;

        document.getElementById("editTeaches").value =
            student.teaches.join(", ");

        document.getElementById("editLearns").value =
            student.learns.join(", ");

        document.getElementById("editAbout").value = student.about;
    }

    // Open the edit form.
    if (editButton && editPanel && editForm && saveMessage) {
        editButton.addEventListener("click", () => {
            fillForm();

            editPanel.hidden = false;
            saveMessage.textContent = "";

            editPanel.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        // Cancel editing.
        const cancelButton = document.getElementById("cancelEdit");

        if (cancelButton) {
            cancelButton.addEventListener("click", () => {
                editPanel.hidden = true;
                saveMessage.textContent = "";
            });
        }

        // Save updated profile information.
        editForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!isOwnProfile) {
                return;
            }

            const newName = document
                .getElementById("editName")
                .value.trim();

            const newBio = document
                .getElementById("editBio")
                .value.trim();

            const newAbout = document
                .getElementById("editAbout")
                .value.trim();

            // Convert comma-separated skills into arrays.
            function parseSkills(value) {
                return [
                    ...new Set(
                        value
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean)
                    ),
                ];
            }

            const newTeaches = parseSkills(
                document.getElementById("editTeaches").value
            );

            const newLearns = parseSkills(
                document.getElementById("editLearns").value
            );

            // Validate required fields.
            if (!newName) {
                saveMessage.textContent = "Please enter your name.";
                return;
            }

            if (!newTeaches.length || !newLearns.length) {
                saveMessage.textContent =
                    "Enter at least one skill in both skill fields.";
                return;
            }

            // Update the profile.
            student.name = newName;
            student.bio = newBio;
            student.about = newAbout;
            student.teaches = newTeaches;
            student.learns = newLearns;

            const profileToSave = {
                name: student.name,
                bio: student.bio,
                about: student.about,
                teaches: student.teaches,
                learns: student.learns,
            };

            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(profileToSave)
                );

                saveMessage.textContent =
                    "Profile saved successfully!";

            } catch (error) {
                console.error("Unable to save profile:", error);

                saveMessage.textContent =
                    "Profile updated for this session, but browser storage failed.";
            }

            // Refresh profile details and matching cards.
            renderProfile();

            // Close the editor.
            editPanel.hidden = true;
        });
    }
}