const onloadPageNum = 1;
const pageSize = 10;
let currentPage = 1;

// Initial value, gets changed in nextButton's EventListener
let maxPage = -1;

const previousLink = document.querySelector(".guestbook-comments > a:first-of-type");
const nextLink = document.querySelector(".guestbook-comments > a:nth-of-type(2)");

previousLink.addEventListener("click", async(event) =>  {
	event.preventDefault();
	console.log("PAIN");

	let url = previousLink.getAttribute('href');
	await setComments(url);
	
	return false;
	// if (currentPage == 1) {
	// 	return
	// } else {
	// 	currentPage--;
	// }
	// const comments = await loadComments(pageSize, currentPage);

	// const guestbookCommentsArticles = document.querySelectorAll(".guestbook-comments > article");
	// const guestbookCommentsWrapper = document.querySelector(".guestbook-comments");
	// // Remove them all
	// if(guestbookCommentsArticles.length > 0){
	// 	guestbookCommentsArticles.forEach(element => {
	// 		guestbookCommentsWrapper.removeChild(element);
	// 	});
	// }
	
	// for (let i = 0; i < pageSize ; i++) {
	// 	let gbArticle = document.createElement("article");
	// 	let gbHeader = document.createElement("header");
	// 	let gbAuthor = document.createElement("p");
	// 	let gbTimeField = document.createElement("p");
	// 	let gbTime = document.createElement("time");
	// 	let gbMessage = document.createElement("p");

	// 	gbAuthor.textContent = "Author: " + comments[i].name;
	// 	gbTimeField.textContent = "Time: ";
	// 	gbTime.textContent = comments[i].time;
	// 	gbTimeField.appendChild(gbTime);
	// 	// TODO: Parse datetime and put it in here
	// 	//gbTime.dateTime = 
	// 	gbMessage.textContent = comments[i].message;
	// 	gbHeader.appendChild(gbAuthor);
	// 	gbHeader.appendChild(gbTimeField);
	// 	gbArticle.appendChild(gbHeader);
	// 	gbArticle.appendChild(gbMessage);

	// 	guestbookCommentsWrapper.appendChild(gbArticle);
	// }
	
}, false);

nextLink.addEventListener("click", async(event) => {
	event.preventDefault;
	console.log("PAIN");
	
	let url = nextLink.getAttribute('href');
	await setComments(url);

	return false;
	// currentPage++;
	
	// const comments = await loadComments(pageSize, currentPage);

	// // If we get fewer comments back than the pageSize, we know we've reached the end.
	// // So now we set the maxPage to that size and we know what the max is.
	// if(comments.length < pageSize) {
	// 	maxPage = currentPage;
	// } 

	// // If maxPage is not the initial value and it's equal to the currentPage,
	// // prevent incrementing!
	// if (maxPage > -1 && maxPage == currentPage) {
	// 	// Reset what we did above, when we incremented it.
	// 	currentPage--;
	// 	return
	// }
	
	// const guestbookCommentsArticles = document.querySelectorAll(".guestbook-comments > article");
	// const guestbookCommentsWrapper = document.querySelector(".guestbook-comments");
	// // Remove them all
	// if(guestbookCommentsArticles.length > 0){
	// 	guestbookCommentsArticles.forEach(element => {
	// 		guestbookCommentsWrapper.removeChild(element);
	// 	});
	// }
	
	// for (let i = 0; i < pageSize ; i++) {
	// 	let gbArticle = document.createElement("article");
	// 	let gbHeader = document.createElement("header");
	// 	let gbAuthor = document.createElement("p");
	// 	let gbTimeField = document.createElement("p");
	// 	let gbTime = document.createElement("time");
	// 	let gbMessage = document.createElement("p");

	// 	gbAuthor.textContent = "Author: " + comments[i].name;
	// 	gbTimeField.textContent = "Time: ";
	// 	gbTime.textContent = comments[i].time;
	// 	gbTimeField.appendChild(gbTime);
	// 	// TODO: Parse datetime and put it in here
	// 	//gbTime.dateTime = 
	// 	gbMessage.textContent = comments[i].message;
	// 	gbHeader.appendChild(gbAuthor);
	// 	gbHeader.appendChild(gbTimeField);
	// 	gbArticle.appendChild(gbHeader);
	// 	gbArticle.appendChild(gbMessage);

	// 	guestbookCommentsWrapper.appendChild(gbArticle);
	// }
	
}, false);

async function setComments(url) {
	// let URLPain = new URL(url);
	// URLPain.searchParams.set('call', 'javascript');

	let resp = await fetch(url + "/?call=javascript");

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