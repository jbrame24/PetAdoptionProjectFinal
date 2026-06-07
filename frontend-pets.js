// Replaces the localStorage-based Pets class
// All calls now go to the real backend API

const API = window.API || "http://localhost:5062/api";

class Pets {

  /* GET ALL */
  static async all() {
    const res = await fetch(`${API}/pets`);
    return res.ok ? await res.json() : [];
  }

  /* ADD */
  static async add(petDto) {
    const res = await fetch(`${API}/pets`, {
      method: "POST",
      headers: Auth.headers(),
      body: JSON.stringify(petDto)
    });
    return res.ok ? await res.json() : null;
  }

  /* UPDATE */
  static async update(pet) {
    const res = await fetch(`${API}/pets/${pet.id}`, {
      method: "PUT",
      headers: Auth.headers(),
      body: JSON.stringify(pet)
    });
    return res.ok ? await res.json() : null;
  }

  /* DELETE */
  static async delete(id) {
    const res = await fetch(`${API}/pets/${id}`, {
      method: "DELETE",
      headers: Auth.headers()
    });
    return res.ok;
  }

  /* REQUEST ADOPTION */
  static async requestAdoption(id) {
    const res = await fetch(`${API}/pets/${id}/request`, {
      method: "PUT",
      headers: Auth.headers()
    });
    return res.ok;
  }

  /* APPROVE */
  static async approve(id) {
    const res = await fetch(`${API}/pets/${id}/approve`, {
      method: "PUT",
      headers: Auth.headers()
    });
    return res.ok;
  }

  /* DENY */
  static async deny(id) {
    const res = await fetch(`${API}/pets/${id}/deny`, {
      method: "PUT",
      headers: Auth.headers()
    });
    return res.ok;
  }
}
