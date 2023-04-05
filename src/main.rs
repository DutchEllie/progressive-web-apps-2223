mod elements;
mod hbs;

use dotenv::dotenv;
use rocket::fs::FileServer;
use rocket_dyn_templates::Template;
use rocket_db_pools::{deadpool_redis, Database};

#[macro_use]
extern crate rocket;

#[derive(Database)]
#[database("redis_cache")]
pub struct Redis(deadpool_redis::Pool);

#[launch]
fn rocket() -> _ {
	dotenv().ok();
	
	let rocket = rocket::build();
	rocket
	.attach(Redis::init())
	.mount("/", routes![hbs::index, hbs::index_comments, hbs::about, hbs::galaxies])
	.mount("/", FileServer::from("dist"))
	.attach(Template::fairing())
	//rocket::build().mount("/", FileServer::from(relative!("html")))
}
