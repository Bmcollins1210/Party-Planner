// ========================================
// CONSTANTS
// ========================================

const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2609-Benny";
const API = BASE + COHORT;

// ========================================
// STATE
// ========================================

let parties = [];
let selectedParty = null;
let rsvps = [];
let guests = [];

// ========================================
// API FUNCTIONS
// ========================================

// Get all parties
async function getParties() {
  try {
    const response = await fetch(`${API}/events`);

    if (!response.ok) {
      throw new Error("Failed to fetch parties");
    }

    const result = await response.json();
    parties = result.data;
  } catch (error) {
    console.error("Error fetching parties:", error);
  }
}

// Get one party by ID
async function getParty(id) {
  try {
    const response = await fetch(`${API}/events/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch party");
    }

    const result = await response.json();
    selectedParty = result.data;

    render();
  } catch (error) {
    console.error("Error fetching party:", error);
  }
}

// Get all RSVPs
async function getRsvps() {
  try {
    const response = await fetch(`${API}/rsvps`);

    if (!response.ok) {
      throw new Error("Failed to fetch RSVPs");
    }

    const result = await response.json();
    rsvps = result.data;
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
  }
}

// Get all guests
async function getGuests() {
  try {
    const response = await fetch(`${API}/guests`);

    if (!response.ok) {
      throw new Error("Failed to fetch guests");
    }

    const result = await response.json();
    guests = result.data;
  } catch (error) {
    console.error("Error fetching guests:", error);
  }
}

// ========================================
// COMPONENTS
// ========================================

// Create one clickable party item
function PartyListItem(party) {
  const $li = document.createElement("li");

  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  const $link = document.createElement("a");
  $link.href = "#selected";
  $link.textContent = party.name;

  $link.addEventListener("click", () => {
    getParty(party.id);
  });

  $li.append($link);

  return $li;
}

// Create the list of parties
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties");

  const $parties = parties.map(PartyListItem);

  $ul.replaceChildren(...$parties);

  return $ul;
}

// Display the selected party details
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");

  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>

    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>

    <address>${selectedParty.location}</address>

    <p>${selectedParty.description}</p>
  `;

  $party.append(GuestList());

  return $party;
}

// Display guests attending the selected party
function GuestList() {
  const $ul = document.createElement("ul");

  const guestsAtParty = guests.filter((guest) =>
    rsvps.some(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id,
    ),
  );

  const $guests = guestsAtParty.map((guest) => {
    const $li = document.createElement("li");
    $li.textContent = guest.name;
    return $li;
  });

  $ul.replaceChildren(...$guests);

  return $ul;
}

// ========================================
// RENDER
// ========================================

function render() {
  const $app = document.querySelector("#app");

  $app.innerHTML = `
    <h1>Party Planner</h1>

    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>

      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
}

// ========================================
// INITIALIZE APPLICATION
// ========================================

async function init() {
  await Promise.all([getParties(), getRsvps(), getGuests()]);

  render();
}

init();
