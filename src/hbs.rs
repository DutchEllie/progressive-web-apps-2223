use crate::elements;
use crate::Redis;
use crate::elements::Comments;
use rocket_db_pools::Connection;
use rocket_dyn_templates::{context, Template};

#[get("/")]
pub async fn index(mut db: Connection<Redis>) -> Template {
	// lowerBound = pageSize * pageNumber - pageSize
	let lower_bound = 0;
	
	// upperBound = pageSize * pageNumber - 1
	let upper_bound = 10;
	
	let res = elements::fetch(db).await.unwrap();
	let res2 = res.get_num(lower_bound, upper_bound);
	
	let context = context! {
		comments: res2,
		previous_page: 1,
		next_page: 2,
	};
	Template::render("index", &context)
}

#[get("/comments/<commentpage>")]
pub async fn index_comments(commentpage: u32, mut db: Connection<Redis>) -> Template {
	let res = get_comments(commentpage, db).await;
	let page_size = 10;

	let mut previous_page = commentpage - 1;
	let mut next_page = commentpage + 1;

	// Examples
	// page_size = 10
	// num_results = 23
	// max_page = (23 - 1) / 10 + 1 = 22 / 10 + 1 = 3 (cuz page 0..10, 10..20, 20..23)
	// 
	// num_results = 18
	// max_page = (18 - 1) / 10 + 1 = 17 / 10 + 1 = 2 (cuz page 0..10, 10..17)
	let max_page = (res.num_results - 1) / page_size + 1;

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

	Template::render("index", &context)
}

#[get("/comments/<commentpage>?<call>")]
pub async fn index_comments_call(commentpage: u32, call: String, mut db: Connection<Redis>) -> Template {
	let res = get_comments(commentpage, db).await;
	let page_size = 10;

	let mut previous_page = commentpage - 1;
	let mut next_page = commentpage + 1;

	// Examples
	// page_size = 10
	// num_results = 23
	// max_page = (23 - 1) / 10 + 1 = 22 / 10 + 1 = 3 (cuz page 0..10, 10..20, 20..23)
	// 
	// num_results = 18
	// max_page = (18 - 1) / 10 + 1 = 17 / 10 + 1 = 2 (cuz page 0..10, 10..17)
	let max_page = (res.num_results - 1) / page_size + 1;

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

	Template::render("comments", &context)
}

async fn get_comments(comment_page: u32, mut db: Connection<Redis>) -> Comments {
	let page_size = 10;
	// lowerBound = pageSize * pageNumber - pageSize
	let lower_bound = page_size * comment_page - page_size;
	// upperBound = pageSize * pageNumber - 1
	let upper_bound = page_size* comment_page - 1;
	let res = elements::fetch(db).await.unwrap();
	let res2 = res.get_num(lower_bound, upper_bound);
	return res2;
}

// impl<'a, 'r> FromRequest<'r> for CallSource {
// 	type Error = ();

// 	fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {
// 		match request.headers().get_one("Call-Source") {
// 			Some(head) => {
// 				Outcome::Success(CallSource("Of".to_string()))
// 			},
// 			None => {
// 				Outcome::Success(CallSource("OOOOF".to_string()))
// 			}
// 		}
// 	}
// }


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
