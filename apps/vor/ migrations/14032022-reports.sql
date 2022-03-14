alter table sessions
    alter column token type uuid using token::uuid;

alter table user_to_schools
    alter column school_id set not null;

alter table user_to_schools
    alter column user_id set not null;

drop index user_to_schools_school_id_user_id_key;

alter table image_to_students
    add primary key (student_id, image_id);

alter table student_to_classes
    add primary key (student_id, class_id);

alter table user_to_schools
    add primary key (school_id, user_id);

alter table student_to_classes
    alter column student_id set not null;

alter table student_to_classes
    alter column class_id set not null;

alter table lesson_plan_details
    drop constraint lesson_plan_details_area_id_fkey;

alter table lesson_plan_details
    add foreign key (class_id) references classes
        on delete set null;

alter table lesson_plan_details
    drop constraint lesson_plan_details_class_id_fkey;

alter table lesson_plan_details
    add foreign key (user_id) references users;

alter table lesson_plan_details
    drop constraint lesson_plan_details_material_id_fkey;

alter table lesson_plan_details
    add foreign key (area_id) references areas
        on delete set null;

alter table lesson_plan_details
    drop constraint lesson_plan_details_user_id_fkey;

alter table lesson_plan_details
    add foreign key (material_id) references materials
        on delete set null;

alter table observation_to_images
    add primary key (observation_id, image_id);

alter table file_to_lesson_plans
    alter column lesson_plan_details_id set not null;

alter table file_to_lesson_plans
    alter column file_id set not null;

alter table file_to_lesson_plans
    add primary key (lesson_plan_details_id, file_id);

alter table lesson_plan_to_students
    alter column lesson_plan_id set not null;

delete from lesson_plan_to_students
    where student_id is null;

alter table lesson_plan_to_students
    alter column student_id set not null;

alter table lesson_plan_to_students
    add primary key (lesson_plan_id, student_id);

alter table video_to_students
    add primary key (student_id, video_id);

alter table image_to_students
    alter column student_id set not null;

alter table image_to_students
    alter column image_id set not null;

create table progress_reports
(
    id                 uuid not null
        primary key,
    school_id          uuid
        references schools
            on delete cascade,
    title              text,
    period_start       timestamp with time zone,
    period_end         timestamp with time zone,
    published          boolean,
    freeze_assessments boolean
);

create table student_progress_reports
(
    student_id         uuid not null
        references students,
    progress_report_id uuid not null
        references progress_reports
            on delete cascade,
    general_comments   text,
    ready              boolean,
    primary key (student_id, progress_report_id)
);

create table student_progress_reports_area_comments
(
    student_progress_report_progress_report_id uuid not null,
    student_progress_report_student_id         uuid not null,
    area_id                                    uuid not null
        references areas,
    comments                                   text,
    primary key (student_progress_report_progress_report_id, student_progress_report_student_id, area_id),
    constraint student_progress_reports_area_student_progress_report_stud_fkey
        foreign key (student_progress_report_student_id,
                     student_progress_report_progress_report_id) references student_progress_reports
);

create table student_progress_report_assessments
(
    student_progress_report_progress_report_id uuid   not null,
    student_progress_report_student_id         uuid   not null,
    material_id                                uuid   not null
        references materials
            on delete cascade,
    assessment                                 bigint not null,
    updated_at                                 timestamp with time zone,
    primary key (student_progress_report_progress_report_id, student_progress_report_student_id, material_id),
    constraint student_progress_report_asses_student_progress_report_stud_fkey
        foreign key (student_progress_report_student_id,
                     student_progress_report_progress_report_id) references student_progress_reports
);

alter table observation_to_images
    alter column observation_id set not null;

alter table observation_to_images
    alter column image_id set not null;

alter table video_to_students
    alter column student_id set not null;

alter table video_to_students
    alter column video_id set not null;

