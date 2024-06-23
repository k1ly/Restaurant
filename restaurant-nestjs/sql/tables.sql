alter table users drop constraint user_role_fk;
alter table users drop constraint user_order_fk;
alter table addresses drop constraint address_user_fk;
alter table dishes drop constraint dish_category_fk;
alter table orders drop constraint order_address_fk;
alter table orders drop constraint order_status_fk;
alter table orders drop constraint order_customer_fk;
alter table orders drop constraint order_manager_fk;
alter table order_items drop constraint order_item_dish_fk;
alter table order_items drop constraint order_item_order_fk;
alter table reviews drop constraint review_user_fk;
alter table reservations drop constraint reservation_table_fk;
alter table reservations drop constraint reservation_customer_fk;

drop table users;
drop table roles;
drop table addresses;
drop table dishes;
drop table categories;
drop table orders;
drop table statuses;
drop table order_items;
drop table reviews;
drop table tables;
drop table reservations;

create table users (
  id serial primary key,
  login varchar(20) not null unique check (
    length(login) between 4 and 20
  ),
  password varchar(200) not null,
  name varchar(40) not null check (
    length(name) between 4 and 40
  ),
  email varchar(320) not null check (
    length(email) between 3 and 320
  ),
  phone varchar(20) null check (
    length(phone) between 8 and 20
  ),
  blocked boolean not null default false,
  role_id int not null,
  order_id int null
);

create table roles (
  id serial primary key,
  name varchar(30) not null unique check (
    length(name) between 1 and 30
  )
);

create table addresses (
  id serial primary key,
  country varchar(50) not null check (
    length(country) between 1 and 50
  ),
  locality varchar(100) not null check (
    length(locality) between 1 and 100
  ),
  street varchar(100) null check (
    length(street) between 1 and 100
  ),
  house varchar(10) not null check (
    length(house) between 1 and 10
  ),
  apartment varchar(10) null check (
    length(apartment) between 1 and 10
  ),
  user_id int not null
);

create table dishes (
  id serial primary key,
  name varchar(100) not null unique check (
    length(name) between 1 and 100
  ),
  description varchar(200) not null check (
    length(description) between 0 and 200
  ),
  image_url varchar(100) null check (
    length(image_url) between 0 and 100
  ),
  weight smallint not null check (weight > 0),
  price float not null default (0) check (price >= 0),
  discount smallint not null default (0) check (
    discount between 0 and 100
  ),
  category_id int not null
);

create table categories (
  id serial primary key,
  name varchar(30) not null unique check (
    length(name) between 1 and 30
  )
);

create table orders (
  id serial primary key,
  price float not null default (0) check (price >= 0),
  specified_date timestamp with time zone null check (specified_date > order_date),
  order_date timestamp with time zone null check (order_date < delivery_date),
  delivery_date timestamp with time zone null check (delivery_date > order_date),
  address_id int null,
  status_id int not null,
  customer_id int not null,
  manager_id int null
);

create table statuses (
  id serial primary key,
  name varchar(30) not null unique check (
    length(name) between 1 and 30
  )
);

create table order_items (
  id serial primary key,
  quantity smallint not null default (1) check (quantity > 0),
  dish_id int not null,
  order_id int not null
);

create table reviews (
  id serial primary key,
  grade smallint not null check (
    grade between 1 and 5
  ),
  comment varchar(1000) not null check (
    length(comment) between 1 and 1000
  ),
  date timestamp with time zone not null default timestamptz(now()),
  user_id int not null
);

create table tables (
  id serial primary key,
  places smallint not null check (places > 0),
  price float not null default (0) check (price >= 0),
  position_x float not null default (0),
  position_y float not null default (0),
  rotation float not null default (0) check (
    rotation between 0 and 75
  ),
  scale_x float not null default (1) check (scale_x > 0),
  scale_y float not null default (1) check (scale_y > 0)
);

create table reservations (
  id serial primary key,
  price float not null check (price >= 0),
  start_date timestamp with time zone not null check (start_date < end_date),
  end_date timestamp with time zone not null check (end_date > start_date),
  date timestamp with time zone not null default timestamptz(now()),
  table_id int not null,
  customer_id int not null
);

alter table users
add constraint user_role_fk foreign key (role_id) references roles (id);
alter table users
add constraint user_order_fk foreign key (order_id) references orders (id);

alter table addresses
add constraint address_user_fk foreign key (user_id) references users (id);

alter table dishes
add constraint dish_category_fk foreign key (category_id) references categories (id);

alter table orders
add constraint order_address_fk foreign key (address_id) references addresses (id);
alter table orders
add constraint order_status_fk foreign key (status_id) references statuses (id);
alter table orders
add constraint order_customer_fk foreign key (customer_id) references users (id);
alter table orders
add constraint order_manager_fk foreign key (manager_id) references users (id);

alter table order_items
add constraint order_item_dish_fk foreign key (dish_id) references dishes (id);
alter table order_items
add constraint order_item_order_fk foreign key (order_id) references orders (id);

alter table reviews
add constraint review_user_fk foreign key (user_id) references users (id) on delete cascade on update cascade;

alter table reservations
add constraint reservation_table_fk foreign key (table_id) references tables (id);
alter table reservations
add constraint reservation_customer_fk foreign key (customer_id) references users (id);