class Pets{

/* GET ALL PETS — from API */
static async all(){
  try{
    const res = await fetch(`${API}/pets`);
    return res.ok ? await res.json() : [];
  } catch(e){
    return [];
  }
}

/* ADD — calls API */
static async add(p){
  const res = await fetch(`${API}/pets`, {
    method: "POST",
    headers: Auth.headers(),
    body: JSON.stringify(p)
  });
  return res.ok ? await res.json() : null;
}

/* UPDATE — calls API */
static async update(p){
  const res = await fetch(`${API}/pets/${p.id}`, {
    method: "PUT",
    headers: Auth.headers(),
    body: JSON.stringify(p)
  });
  return res.ok ? await res.json() : null;
}

/* DELETE — calls API */
static async delete(id){
  const res = await fetch(`${API}/pets/${id}`, {
    method: "DELETE",
    headers: Auth.headers()
  });
  return res.ok;
}

/* REQUEST ADOPTION — calls API */
static async requestAdoption(id){
  const res = await fetch(`${API}/pets/${id}/request`, {
    method: "PUT",
    headers: Auth.headers()
  });
  return res.ok;
}

/* APPROVE — calls API */
static async approve(id){
  const res = await fetch(`${API}/pets/${id}/approve`, {
    method: "PUT",
    headers: Auth.headers()
  });
  return res.ok;
}

/* DENY — calls API */
static async deny(id){
  const res = await fetch(`${API}/pets/${id}/deny`, {
    method: "PUT",
    headers: Auth.headers()
  });
  return res.ok;
}

}
