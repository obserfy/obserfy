alter sequence weekdays_day_seq no minvalue;

alter table students
    add gender integer;

alter table students
    add date_of_entry timestamp with time zone;

alter table students
    add note text;

alter table students
    add custom_id text;

alter table students
    add active boolean;

alter table students
    add profile_pic text;

create table guardians
(
    id uuid not null
        constraint guardians_pkey
            primary key,
    name text not null,
    email text,
    phone text,
    note text,
    school_id uuid
        constraint guardians_school_id_fkey
            references schools
);

create table guardian_to_students
(
    student_id uuid
        constraint guardian_to_students_student_id_fkey
            references students
            on delete cascade,
    guardian_id uuid
        constraint guardian_to_students_guardian_id_fkey
            references guardians
            on delete cascade,
    relationship integer
);

alter table user_to_schools
    add constraint user_to_schools_school_id_fkey
        foreign key (school_id) references schools;

alter table user_to_schools
    add constraint user_to_schools_user_id_fkey
        foreign key (user_id) references users;

