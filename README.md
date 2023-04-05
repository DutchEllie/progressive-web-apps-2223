# PWA with Rocket Rust

I made this progressive web app for the minor Web Design & Development for Progressive Web App.
The server side code is written in Rust, using the Rocket framework.
It renders the HTML with Handlebars on the server before sending it to the client.
Most of the functionality of the site is still available without JS this way, unlike the version I wrote with Svelte originally.

The HTML and CSS are based on the code I wrote for CSS to the rescue.

## Week 1 - Monday and Tuesday

I wrote the code for the webserver and made the comment section server side rendered on the first two days.
This was a little difficult, but not too bad.
It was a bit difficult to get a grip on the Rocket framework and on Rust itself, but it was doable.
It's a good thing I am not a bad server-side programmer, if I say so myself.

```rust
#[launch]
fn rocket() -> _ {
	dotenv().ok();
	
	let rocket = rocket::build();
	rocket
	.attach(Redis::init())
	.mount("/", routes![hbs::index, hbs::index_comments, hbs::about, hbs::galaxies])
	.mount("/static", FileServer::from("html/static"))
	.attach(Template::fairing())
	//rocket::build().mount("/", FileServer::from(relative!("html")))
}
```

The "/" endpoint is routed to the "hbs" module and the routes that are in there.

Those look something like this:

```rust
#[get("/about")]
pub fn about() -> Template {
	let context = context! {};
	Template::render("about", &context)
}

#[get("/galaxies")]
pub fn galaxies() -> Template {
	let context = context! {};
	Template::render("galaxies", &context)
}
```

These are the simple pages, so there is not really any code special to those pages (yet).
The index page and the special comments endpoint are a little more involved.

```rust
// A struct containing only a String
pub struct Data(String);

// Implementing the FromRequest trait for Data.
// When a page with the Data struct as a parameter gets called this gets executed.
// If the "callsource" HTTP header is not set, then the "not-js" String gets put in the Data struct. The page function looks at the value of this string and if it's "not-js" then you get the entire page.
// If it's anything else, then only the comments in HTML get returned
#[rocket::async_trait]
impl<'r> FromRequest<'r> for Data {
	type Error = ();

	async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
		match req.headers().get_one("callsource") {
			Some(val) => { Outcome::Success(Data(val.to_string())) },
			None => { Outcome::Success(Data("not-js".to_string())) }
		}
	}
}

// Just literally return the page
#[get("/")]
pub async fn index(mut db: Connection<Redis>) -> Template {
	let (_, res) = get_comments(1, db).await;
	
	let context = context! {
		comments: res,
		previous_page: 1,
		next_page: 2,
	};

	Template::render("index", &context)
}

// This endpoint returns the entire "index" template rendered with the appropriate comments for that page.
// However, if the callsource HTTP header has been set (checked above in the from_request function) only the HTML for the comments will be returned!
// If the user has JS, then the JS will call this endpoint with that custom HTTP header, but if the user doesn't have JS then the entire page will be returned instead.
// This means that the page works both with and without JS.
#[get("/comments/<commentpage>")]
pub async fn index_comments(commentpage: u32, data: Data, mut db: Connection<Redis>) -> Template {
	let (max_page, res) = get_comments(commentpage, db).await;
	let page_size = 10;

	let mut previous_page = commentpage - 1;
	let mut next_page = commentpage + 1;

	if commentpage == 1 {
		previous_page = commentpage;
	}
	if commentpage + 1 > max_page {
		next_page = max_page;
	}

	let context = context! {
		comments: res,
		previous_page: previous_page,
		next_page: next_page
	};

	return match data.0.as_str() {
		"not-js" => {
			Template::render("index", &context)
		}
		_ => {
			Template::render("comments", &context)
		}
	}
}

// Returns the maximum page that can be reached and the comments that should be displayed on the page with the number comment_page (passed into the function as a parameter)
async fn get_comments(comment_page: u32, mut db: Connection<Redis>) -> (u32, Comments) {
	let page_size = 10;
	// lowerBound = pageSize * pageNumber - pageSize
	let lower_bound = page_size * comment_page - page_size;
	// upperBound = pageSize * pageNumber - 1
	let upper_bound = page_size* comment_page - 1;
	let res = elements::fetch(db).await.unwrap();
	let res2 = res.get_num(lower_bound, upper_bound);

	// Examples
	// page_size = 10
	// num_results = 23
	// max_page = (23 - 1) / 10 + 1 = 22 / 10 + 1 = 3 (cuz page 0..10, 10..20, 20..23)
	// 
	// num_results = 18
	// max_page = (18 - 1) / 10 + 1 = 17 / 10 + 1 = 2 (cuz page 0..10, 10..17)
	let max_page = (res.num_results - 1) / page_size + 1;
	return (max_page, res2);
}
```

## Week 2 - Monday and Tuesday

These days I did not have the most time to work on this project.
I worked on the ServiceWorker today, regardless.
I wanted to make most of the app entirely offline, if possible.
To do this, I made the ServiceWorker prefetch some pages when it first gets installed, then when fetch events happen, it caches all of the content too.

When a user then loads a resource from the server, the ServiceWorker immediately serves from the cache and loads the page in the background to update the cache.
I intend to provide a seamless experience, so there is no update message on the website.

This is the activity diagram for the ServiceWorker:

![Activity Diagram ServiceWorker](docs/activity%20diagram%20sw.jpg)

## Week 3 - Monday and Tuesday

On Monday, I tried to get a feature working called an ETag on the Rocket Webserver.
It turns out that Rocket is actually kind of a shit framework and it doesn't have it implemented at all.
In fact, it implements basically nothing except for Content-Type.
I gave up on implementing it myself, since it's kind of complicated and it would take way too much time.

Then I wanted to add a cache header to the responses, but naturally, those are not implemented in Rocket.
Also, I needed to add gzip compression.
Guess what also isn't documented, or even really findable in their reference?
Yup, gzip compression.
Just like everything else, neither their documentation nor reference include anything to do with the things you might want to do, aside from fucking templating pages.

Absolutely pathetic.
