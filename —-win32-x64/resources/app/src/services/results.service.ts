import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Response } from 'src/model/response';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http:HttpClient) { }

  getResults(indexNo:number){
    const headers = new HttpHeaders({'Access-Control-Allow-Origin':'*','Content-Type': 'application/json'});
    
    return this.http.get<Response>(`https://doenets.lk/result/service/AlResult/${indexNo}`,{headers:headers});
  }
}
