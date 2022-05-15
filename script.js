var BASE_API = "https://api.github.com";

var options = undefined;

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("u");
  const apikey = urlParams.get("apikey");

  if(apikey){
    options = { headers: { Authorization: `token ${apikey}` } };
  }

  const buscaElement = document.getElementById("git-busca-container");
  const nav = document.querySelector(".nav");
  if (userName) {
    const infoElement = document.getElementById("git-info-container");
    buscaElement.style.display = "none";
    infoElement.style.display = "block";
    nav.style.display = "flex";
    init(userName);
  } else {
    nav.style.display = "none";
    buscaElement.style.display = "flex";
  }
};

async function fetchUsersByLogin(username) {
  const res = await fetch(`${BASE_API}/users/${username}`, options);
  const json = await res.json();

  return json;
}

async function fetchFollwers(followers_url) {
  console.log("followers_url", followers_url);
  const res = await fetch(followers_url, options);
  const json = await res.json();

  return json;
}

async function init(user) {
  const me = await fetchUsersByLogin(user);
  console.log("ME", me);

  renderCurrentProfileAsync(me.login, me.avatar_url);

  const followers = await fetchFollwers(me.followers_url);
  //   console.log('followers', followers[0])
  renderCurrentFollowers(followers);
}

function renderCurrentFollowers(followers) {
  const followersCount = document.getElementById("followers-count");
  followersCount.innerHTML = ` (${followers.length})`;

  const followersElement = document.getElementById("followers");
  for (f of followers) {
    const item = `
        <a href='?u=${f.login}' class='item animate__bounceIn'>
            <div class="image-container w-sm">
                <img src="https://github.com/${f.login}.png" alt="">
            </div>
            <div class="item-info">
                <h4>${f.login}</h4>
                <p><span class='link' >@${f.login}</span></h5>
            </div>
        </a>
        `;


    const li = document.createElement("li");
    li.innerHTML = item;

    followersElement.appendChild(li);
  }
}

async function renderCurrentProfileAsync(login, imgUrl) {
  const currentLogin = document.getElementById("current-login");
  const currentImgContainer = document.getElementById("current-img-container");

  const img = await createImgAsync(`https://github.com/${login}.png`);

  currentImgContainer.innerHTML = "";
  currentImgContainer.appendChild(img);
  currentLogin.textContent = login;
}

async function getUrlAsync(url) {
  const res = await fetch(url);
  const blob = await res.blob();

  const localUrl = URL.createObjectURL(blob);
  return localUrl;
}
async function createImgAsync(url) {
  //   const res = await myFetch(url);
  //   const blob = await res.blob();

  //   const localUrl = URL.createObjectURL(blob);

  const imgElement = document.createElement("img");
  imgElement.src = url;

  return imgElement;
}

// init();
