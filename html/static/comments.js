const onloadPageNum = 1;
const pageSize = 10;
let currentPage = 1;

// Initial value, gets changed in nextButton's EventListener
let maxPage = -1;

const previousLink = document.querySelector(".guestbook > a:first-of-type");
const nextLink = document.querySelector(".guestbook > a:nth-of-type(2)");

previousLink.addEventListener("click", async(event) =>  {
	event.preventDefault();
	console.log("PAIN");

	let url = previousLink.getAttribute('href');
	await setComments(url);
	
	return false;
}, false);

nextLink.addEventListener("click", async(event) => {
	event.preventDefault();
	console.log("PAIN");
	
	let url = nextLink.getAttribute('href');
	await setComments(url);

	return false;
}, false);

async function setComments(url) {
	let resp = await fetch(url, {
		headers: {
			callsource: "js"
		}
	});

	let data = await resp.text();
	
	const guestbookCommentsWrapper = document.querySelector('.guestbook-comments > div');
	guestbookCommentsWrapper.innerHTML = data;
}

async function loadComments(pageSize, pageNumber) {
	let apiURL = "https://api.quenten.nl/api/testing/comment";
	let res = await fetch(apiURL);
	res2 = await res.json();
	
	// pageSize = 10
	// pageNumber = 2
	// lowerBound = pageSize * pageNumber - pageSize = 10
	let lowerBound = pageSize * pageNumber - pageSize;
	
	// pageSize = 10
	// pageNumber = 2
	// upperBound = pageSize * pageNumber - 1 = 19
	let upperBound = pageSize * pageNumber;
	return res2.slice(lowerBound, upperBound);
}