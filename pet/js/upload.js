class Upload{

static toBase64(file, callback){

  // ❌ No file selected
  if(!file){
    alert("No file selected");
    return;
  }

  // ❌ Only allow images
  if(!file.type.startsWith("image/")){
    alert("Please upload an image file");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    callback(reader.result);
  };

  reader.onerror = () => {
    alert("Error reading file");
  };

  reader.readAsDataURL(file);
}

}