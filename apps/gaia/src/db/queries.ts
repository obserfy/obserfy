/** Types generated for queries found in "src/db/queries.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'FindChildObservationsGroupedByDateQuery' parameters type */
export interface IFindChildObservationsGroupedByDateQueryParams {
  childId: string | null | void;
}

/** 'FindChildObservationsGroupedByDateQuery' return type */
export interface IFindChildObservationsGroupedByDateQueryResult {
  event_time: Date | null;
  json_agg: Json | null;
}

/** 'FindChildObservationsGroupedByDateQuery' query type */
export interface IFindChildObservationsGroupedByDateQueryQuery {
  params: IFindChildObservationsGroupedByDateQueryParams;
  result: IFindChildObservationsGroupedByDateQueryResult;
}

const findChildObservationsGroupedByDateQueryIR: any = {"name":"FindChildObservationsGroupedByDateQuery","params":[{"name":"childId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":140,"b":146,"line":4,"col":23}]}}],"usedParamSet":{"childId":true},"statement":{"body":"select o1.event_time::date, json_agg(o1)\nfrom observations as o1\nwhere o1.student_id = :childId\ngroup by o1.event_time::date","loc":{"a":52,"b":175,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * select o1.event_time::date, json_agg(o1)
 * from observations as o1
 * where o1.student_id = :childId
 * group by o1.event_time::date
 * ```
 */
export const findChildObservationsGroupedByDateQuery = new PreparedQuery<IFindChildObservationsGroupedByDateQueryParams,IFindChildObservationsGroupedByDateQueryResult>(findChildObservationsGroupedByDateQueryIR);


