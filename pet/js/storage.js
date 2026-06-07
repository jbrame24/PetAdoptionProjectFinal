const API = "http://localhost:5000/api";
const app = document.getElementById("app");

class Storage{

static get(key){
  let data = localStorage.getItem(key);

  if(!data) return null;  

  try{
    return JSON.parse(data);
  }catch{
    return null;
  }
}

static set(key,data){
  localStorage.setItem(key, JSON.stringify(data));
}

/* ARRAY GETTER */
static getArray(key){
  let data = this.get(key);
  return Array.isArray(data) ? data : [];
}

/* OBJECT GETTER */
static getObject(key){
  let data = this.get(key);
  return typeof data === "object" && !Array.isArray(data) ? data : {};
}

/* REMOVE */
static remove(key){
  localStorage.removeItem(key);
}

}