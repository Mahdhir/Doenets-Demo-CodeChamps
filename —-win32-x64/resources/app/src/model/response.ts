import { subjectResults } from './subjectResults';
//Response Data Model
export interface Response{
    districtRank:string;
    examination:string;
    indexNo:string;
    islandRank:string;
    name:string;
    stream:string;
    year:string;
    zScore:string;
    errMsge:string;
    subjectResults: subjectResults[];
}