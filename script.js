let allItems = [];


fetch("items.json")
  .then(response => response.json())
  .then(data => {
    
    allItems = data;
    
    showItems(allItems);
    
    showTopItems();
    
    showTrendingItems();
    
    updateStats();
    
  });




function showItems(items) {
  
  const area = document.getElementById("items");
  
  area.innerHTML = "";
  
  
  items.forEach(item => {
    
    
    let rarityClass = item.category
      .toLowerCase()
      .split(" ")[0];
    
    
    
    area.innerHTML += `

<div class="card ${rarityClass}" onclick='openDetail(${JSON.stringify(item)})'>
<div class="rarity-tag ${rarityClass}">
${item.category}
</div>

<img 
src="${item.image || `images/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`}"
class="item-image"
alt="${item.name}"
>


<h2>${item.name}</h2>

<button 
class="favorite-btn"
onclick="addFavorite(event, '${item.name}')">
⭐
</button>

<p>📂 ${item.category}</p>

<p>🔫 ${item.type}</p>


<h3>💰 Value: ${item.value}</h3>


<p>📊 Demand: ${item.demand}/10</p>


<p>
${item.obtained} • ${item.year}
</p>


</div>

`;
    
  });
  
  
}






function showTopItems() {
  
  
  let topArea = document.getElementById("topItems");
  
  
  if (!topArea) {
    
    return;
    
  }
  
  
  
  topArea.innerHTML = "";
  
  
  
  let topItems = [...allItems]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  
  
  
  topItems.forEach(item => {
    
    
    topArea.innerHTML += `


<div class="top-card" onclick='openDetail(${JSON.stringify(item)})'>


<img 
src="${item.image || `images/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`}"
class="top-image"
>


<div>

<h3>${item.name}</h3>


<p>
💰 ${item.value} Value
</p>


</div>


</div>


`;
    
    
    
  });
  
  
}







document
  .getElementById("searchBox")
  .addEventListener("input", filter);



document
  .getElementById("category")
  .addEventListener("change", filter);

document
  .getElementById("sort")
  .addEventListener("change", filter);



function filter() {
  
  
  let text =
    document
    .getElementById("searchBox")
    .value
    .toLowerCase();
  
  
  
  let cat =
    document
    .getElementById("category")
    .value;
  
  
  
  let result =
    allItems.filter(item => {
      
      
      
      return (
        
        
        item.name
        .toLowerCase()
        .includes(text)
        
        
        
        &&
        
        
        
        (cat == "all" ||
          
          item.category == cat)
        
        
      );
      
      
    });
  
  
  
  let sort =
  document.getElementById("sort").value;

if (sort == "high") {
  
  result.sort((a, b) => b.value - a.value);
  
}

else if (sort == "low") {
  
  result.sort((a, b) => a.value - b.value);
  
}

else if (sort == "demand") {
  
  result.sort((a, b) => b.demand - a.demand);
  
}

else if (sort == "az") {
  
  result.sort((a, b) => a.name.localeCompare(b.name));
  
}

else if (sort == "za") {
  
  result.sort((a, b) => b.name.localeCompare(a.name));
  
}

showItems(result);
  
  
}







function openDetail(item) {
  
  
  localStorage.setItem(
    
    "selectedItem",
    
    JSON.stringify(item)
    
  );
  
  
  
  window.location.href = "detail.html";
  
  
}
function addFavorite(event, name) {
  
  event.stopPropagation();
  
  let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];
  
  let item =
    allItems.find(x => x.name === name);
  
  if (!item) return;
  
  let exists =
    favorites.some(x => x.name === name);
  
  if (!exists) {
    
    favorites.push(item);
    
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
    
    showToast("⭐ Favorilere eklendi");
    updateStats();
  } else {
    
    showToast("⭐ Bu item zaten favorilerde");
    
  }
  
}
function showTrendingItems() {
  
  const area = document.getElementById("trendingItems");
  
  if (!area) return;
  
  area.innerHTML = "";
  
  let trending = [...allItems]
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 4);
  
  trending.forEach(item => {
    
    area.innerHTML += `

<div class="trending-card" onclick='openDetail(${JSON.stringify(item)})'>

<img src="${item.image || 'images/default.png'}">

<div>

<h3>${item.name}</h3>

<p>🔥 Demand ${item.demand}/10</p>

</div>

</div>

`;
    
  });
  
}
function showToast(message) {
  
  const toast = document.getElementById("toast");
  
  if (!toast) return;
  
  toast.textContent = message;
  
  toast.classList.add("show");
  
  setTimeout(() => {
    
    toast.classList.remove("show");
    
  }, 2000);
  
}
function updateStats() {
  
  const itemCount =
    document.getElementById("itemCount");
  
  const favoriteCount =
    document.getElementById("favoriteCount");
  
  if (itemCount) {
    
    itemCount.textContent =
      `📦 ${allItems.length} Items`;
    
  }
  
  if (favoriteCount) {
    
    const favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];
    
    favoriteCount.textContent =
      `⭐ ${favorites.length} Favorites`;
    
  }
  
}