import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private __baseUrl = "http://localhost:3000/";
  constructor(private httpClient: HttpClient) {}

  getSessionData() {
    return this.httpClient.get<any>(`${this.__baseUrl}session`, {
      headers: { sid: "43272871-5444-454f-a7d7-6b693eb4f9f1" },
    });
  }
}
