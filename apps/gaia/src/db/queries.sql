/* @name FindChildObservationsGroupedByDateQuery */
select o1.event_time::date, json_agg(o1)
from observations as o1
where o1.student_id = :childId
group by o1.event_time::date;
