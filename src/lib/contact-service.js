const API_URL = "http://localhost:8080/api/contacts";

async function parseJSON(response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  }
  return null;
}

export async function getContacts() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    const errorData = await parseJSON(res);
    throw new Error(errorData?.message || "Failed to fetch contacts");
  }
  return await parseJSON(res) || [];
}

export async function getContactById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    const errorData = await parseJSON(res);
    throw new Error(errorData?.message || `Contact with ID ${id} not found`);
  }
  return await parseJSON(res);
}

export async function addContact(contact) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (!res.ok) {
    const errorData = await parseJSON(res);
    throw new Error(errorData?.message || "Failed to create contact");
  }
  return await parseJSON(res);
}

export async function updateContact(id, contact) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (!res.ok) {
    const errorData = await parseJSON(res);
    throw new Error(errorData?.message || `Failed to update contact with ID ${id}`);
  }
  return await parseJSON(res);
}

export async function deleteContact(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await parseJSON(res);
    throw new Error(errorData?.message || `Failed to delete contact with ID ${id}`);
  }
  return true; 
}

export async function searchContacts(query) {
  const allContacts = await getContacts();
  if (!query) return allContacts;

  const lowerCaseQuery = query.toLowerCase();
  return allContacts.filter(contact =>
    contact.name.toLowerCase().includes(lowerCaseQuery) ||
    contact.phone.includes(query) ||
    (contact.email && contact.email.toLowerCase().includes(lowerCaseQuery))
  );
}