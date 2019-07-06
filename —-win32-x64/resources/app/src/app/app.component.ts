import { subjectResults } from './../model/subjectResults';
import { Component } from '@angular/core';
import { ResultsService } from '../services/results.service';
import { Response } from 'src/model/response';
import { ToastrService } from 'ngx-toastr';

declare var require: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any = null;
  index = "";
  click;
  batchFile: any[] = [];
  dataToWrite: any = "";
  constructor(
    private resultsService: ResultsService,
    private toastr: ToastrService,
  ) {

  }

  // Get the result for an individual result call
  async getResults() {
    if (isNaN(Number(this.index))) {
      this.data = null;
      this.click = false;
      this.toastr.error("Incorrect Input");
      return;
    }
    this.click = true;
    let indexNumber: number = Number(this.index);
    try {
      let result = await this.resultsService.getResults(indexNumber).toPromise();
      if (result.errMsge) {
        this.toastr.error(result.errMsge);
        this.click = false;
        this.data = null;
        return;
      }
      this.data = result;
    } catch (error) {
      this.click = false;
      console.log(error);
      if (error.status === 0)
        this.toastr.error("No Internet Connection");
      else this.toastr.error(error.message);
    }

  }

  //Compute the string to write into text file
  async computeStringToWrite() {
    for (var i = 0; i < this.batchFile.length; i++) {
      this.dataToWrite += `Index No=${this.batchFile[i].indexNo}\n`;
      this.dataToWrite += `Name=${this.batchFile[i].name}\n`;
      this.dataToWrite += `Stream=${this.batchFile[i].stream}\n`;
      this.dataToWrite += `District Rank=${this.batchFile[i].districtRank}\n`;
      this.dataToWrite += `Island Rank=${this.batchFile[i].islandRank}\n`;
      this.dataToWrite += `Z Score=${this.batchFile[i].zScore}\n`;
      this.dataToWrite += `--------Subjects-------\n`;
      for (var j = 0; j < this.batchFile[i].subjectResults.length; j++) {
        let row = this.batchFile[i].subjectResults[j];
        this.dataToWrite += `${row.subjectName} = ${row.subjectResult}\n`;
      }
      this.dataToWrite += '\n\n';
    }

  }

  //Check Whether Batch Result or Individual Result
  async checkResults() {
    if (this.index.includes(',')) {
      let numbers = await this.index.split(',');
      let returnFromFn;
      for (var val of numbers) {
        returnFromFn = await this.checkMultipleResults(val);
        if (returnFromFn == -1)
          break;
      }

      //Sort The Data In Zscore Descending
      await this.batchFile.sort((a, b) => (a.zScore > b.zScore) ? -1 : 1);
      await this.computeStringToWrite();

      //Write to File using file-saver.js
      if (returnFromFn != -1) {
        var FileSaver = require('file-saver');
        var blob = new Blob([this.dataToWrite], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "AlevelResults.txt");
        this.toastr.success("Results Have Been Downloaded");
      }

    } else {
      await this.getResults()
    }

  }

  //Call API for Batch Result
  async checkMultipleResults(index) {

    if (isNaN(Number(index))) {
      this.data = null;
      this.click = false;
      this.toastr.error("Incorrect Input");
      return;
    }
    this.click = true;
    let indexNumber: number = Number(index);
    try {
      let result = await this.resultsService.getResults(indexNumber).toPromise();
      if (result.errMsge) {
        this.toastr.error(result.errMsge);
        this.click = false;
        return;
      }
      await this.batchFile.push(result);
      this.click = false;
    } catch (error) {
      if (error.status === 0)
        this.toastr.error("No Internet Connection");
      else this.toastr.error(error.message);
      this.click = false;
      return -1;
    }


  }

}


