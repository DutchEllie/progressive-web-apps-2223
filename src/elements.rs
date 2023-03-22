use rocket_db_pools::deadpool_redis::redis::{AsyncCommands, RedisFuture};
use rocket_db_pools::deadpool_redis::{self};
use rocket_db_pools::Connection;
use serde::{Deserialize, Serialize};
use tokio::join;

use crate::Redis;

#[derive(Serialize, Deserialize, Clone)]
pub struct Comment {
	#[serde(rename(deserialize = "name"))]
	pub author_name: String,
	#[serde(rename(deserialize = "time"))]
	pub date_time: String, // TODO: Make this a DateTime
	#[serde(rename(deserialize = "message"))]
	pub message: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Comments {
	pub num_results: u32,
	comments: Vec<Comment>,
}

pub async fn fetch(mut db: Connection<Redis>) -> Result<Comments, Box<dyn std::error::Error>> {
	// let commenthash_api_url = "https://api.quenten.nl/api/testing/commenthash";
	
	// // Start fetching the commenthash from the API
	// let api_commenthash_fut = reqwest::get(commenthash_api_url);
	// let redis_commenthash_fut: RedisFuture<String> = db.get("commenthash");
	
	// let (api_commenthash, redis_commenthash) = join!(api_commenthash_fut, redis_commenthash_fut);

	// // println!("{}", api_commenthash?.text().await.unwrap());
	// let api_commenthash2 = api_commenthash?.text().await.unwrap();
	// let _: RedisFuture<String> = db.set("commenthash", &api_commenthash2);
	// if api_commenthash2 == redis_commenthash.unwrap() {
	// 	println!("THEY ARE EQUAL!!");
	// } else {

	// }
	
	// Start fetching the commentHash from Redis
	// Wait for them both to finish
	// Compare the two
	// If the same, start fetching (and awaiting) the comments from Redis
	// If not the same, start fetching (and awaiting) the comments from the API
	// 	Then compute the hash and save it

	let comment_api_url = "https://api.quenten.nl/api/testing/comment";
	
	let resp = reqwest::get(comment_api_url).await?.json::<Vec<Comment>>().await?;
	let result: Comments = Comments {
		num_results: resp.len() as u32,
		comments: resp.clone(),
	};
	
	Ok(result)
}

impl Comments {
	// Returns the first "num" comments from the array
	// returns all numbers if num is too small
	pub fn get_num(self: &Self, lower_bound: u32, upper_bound: u32) -> Comments {
		match self.comments.get(lower_bound as usize..upper_bound as usize) {
			Some(val) => Comments {
				comments: val.to_vec(),
				num_results: 10,
			},
			None => self.clone(),
		}
	}
}
